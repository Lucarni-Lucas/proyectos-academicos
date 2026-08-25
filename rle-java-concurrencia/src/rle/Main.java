package rle;

import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class Main {

    /**
     * Punto de entrada del programa RLE concurrente.
     *
     * Parámetros:
     *   archivoEntrada  Ruta al archivo de entrada (texto UTF-8 para encode, binario para decode).
     *   archivoSalida   Ruta donde se escribirá el archivo de salida.
     *   modo            "encode" o "decode".
     *   nWorkers        Cantidad de RLEWorkers a lanzar (número entero positivo).
     *   tamBuffer       Capacidad máxima del Buffer (número entero positivo).
     *
     * Uso:
     *   java rle.Main <archivoEntrada> <archivoSalida> <modo> <nWorkers> <tamBuffer>
     *
     * Ejemplo:
     *   java rle.Main entrada.txt salida.bin encode 4 16
     *   java rle.Main salida.bin recuperado.txt decode 4 16
     */
    public static void main(String[] args) throws Exception {

        // --- Validación de argumentos ---
        if (args.length < 5) {
            System.out.println("Uso: java rle.Main <archivoEntrada> <archivoSalida> <modo> <nWorkers> <tamBuffer>");
            System.out.println("     modo: encode | decode");
            System.out.println("Ejemplo: java rle.Main entrada.txt salida.bin encode 4 16");
            return;
        }

        String archivoEntrada = args[0];
        String archivoSalida  = args[1];
        String modo           = args[2];
        int nWorkers          = Integer.parseInt(args[3]);
        int tamBuffer         = Integer.parseInt(args[4]);

        if (nWorkers <= 0) {
            System.err.println("Error: nWorkers debe ser mayor a 0.");
            return;
        }
        if (tamBuffer <= 0) {
            System.err.println("Error: tamBuffer debe ser mayor a 0.");
            return;
        }
        if (!modo.equals("encode") && !modo.equals("decode")) {
            System.err.println("Error: modo debe ser 'encode' o 'decode'.");
            return;
        }

        // --- Crear infraestructura concurrente ---
        Buffer buffer         = new Buffer(tamBuffer);
        WorkerCounter counter = new WorkerCounter(nWorkers);
        ThreadPool pool       = new ThreadPool(nWorkers, buffer, counter);

        // --- Iniciar medición de tiempo e iniciar workers ---
        long tiempoInicio = System.currentTimeMillis();
        pool.iniciar();

        // --- Procesar según el modo ---
        if (modo.equals("encode")) {
            runEncode(archivoEntrada, archivoSalida, nWorkers, buffer, counter);
        } else {
            runDecode(archivoEntrada, archivoSalida, nWorkers, buffer, counter);
        }

        long tiempoFin = System.currentTimeMillis();
        double segundos = (tiempoFin - tiempoInicio) / 1000.0;
        System.out.printf("Tiempo de procesamiento: %.3f segundos%n", segundos);
    }










    // -------------------------------------------------------------------------
    // Modo encode
    // -------------------------------------------------------------------------

    /**
     * Carga el archivo de texto, lo particiona, crea las EncodeTask, las mete en el Buffer, espera a los workers y llama al ensamblado.
     * 
     * @param archivoEntrada Ruta del archivo de texto de entrada (UTF-8).
     * @param archivoSalida Ruta del archivo binario de salida.
     * @param nWorkers Cantidad de workers a lanzar.
     * @param buffer Buffer compartido para las tareas.
     * @param counter Contador para sincronizar el fin de los workers.
     */
    static void runEncode(  String archivoEntrada, 
                                    String archivoSalida,
                                    int nWorkers, 
                                    Buffer buffer, 
                                    WorkerCounter counter)  throws Exception {

        // --- Leer el archivo de texto en UTF-8 y convertir a codepoints ---
        String texto = Files.readString(Path.of(archivoEntrada), StandardCharsets.UTF_8);
        int[] codepoints = texto.codePoints().toArray();
        int total = codepoints.length;

        System.out.printf("Encode: %d codepoints leídos de '%s'%n", total, archivoEntrada);

        // --- Calcular segmentos — no crear más segmentos que codepoints disponibles ---
        int nSegmentos = Math.min(nWorkers, total);

        // --- Archivo vacío: escribir archivo binario vacío y terminar ---
        if (nSegmentos == 0) {
            // los workers solo recibe PoisonPills
            for (int i = 0; i < nWorkers; i++) buffer.put(new PoisonPill());
            counter.esperarFin();
            new java.io.FileOutputStream(archivoSalida).close();
            return;
        }

        ResultadoEncode[] resultados = new ResultadoEncode[nSegmentos];
        int quotient = total / nSegmentos;
        int remainder = total % nSegmentos;

        // ---- Crear y encolar las EncodeTask ---
        for (int i = 0; i < nSegmentos; i++) {
            int tamSegmento = quotient + (i < remainder ? 1 : 0);
            int desde = i * quotient + Math.min(i, remainder);
            int hasta = desde + tamSegmento;
            buffer.put(new EncodeTask(codepoints, desde, hasta, i, resultados));
        }

        // --- Encolar una PoisonPill por worker para que todos terminen --- 
        for (int i = 0; i < nWorkers; i++) {
            buffer.put(new PoisonPill());
        }

        // --- Bloquear hasta que todos los workers terminen --- 
        counter.esperarFin();

        // --- Ensamblar los resultados en orden y escribir el archivo binario ---
        ensamblarEncode(resultados, archivoSalida); 
        System.out.printf("Archivo binario escrito en '%s'%n", archivoSalida);
    }












    // -------------------------------------------------------------------------
    // Modo decode
    // -------------------------------------------------------------------------

    /**
     * Carga el archivo binario, lo particiona por pares, crea las DecodeTask, las mete en el Buffer, espera a los workers y llama al ensamblado.
     * 
     * @param archivoEntrada Ruta del archivo binario de entrada.
     * @param archivoSalida Ruta del archivo de texto de salida (UTF-8).
     * @param nWorkers Cantidad de workers a lanzar.
     * @param buffer Buffer compartido para las tareas.
     * @param counter Contador para sincronizar el fin de los workers.
     */
    static void runDecode(  String archivoEntrada, 
                                    String archivoSalida,
                                    int nWorkers, 
                                    Buffer buffer, 
                                    WorkerCounter counter)  throws Exception {

        // --- Leer el archivo binario completo en memoria ---
        byte[] bytes = Files.readAllBytes(Path.of(archivoEntrada));
        
        // --- Cada par (codepoint, cantidad) ocupa 8 bytes (2 enteros de 4 bytes cada uno) ---
        int nPares = bytes.length / 8;

        System.out.printf("Decode: %d pares leídos de '%s'%n", nPares, archivoEntrada);

        // --- Calcular segmentos — no crear más segmentos que pares disponibles ---
        int nSegmentos = Math.min(nWorkers, nPares);

        
        // --- Archivo binario vacío: escribir archivo de texto vacío y terminar ---
        if (nSegmentos == 0) {
            for (int i = 0; i < nWorkers; i++) buffer.put(new PoisonPill());
            counter.esperarFin();
            Files.writeString(Path.of(archivoSalida), "", StandardCharsets.UTF_8);
            return;
        }

        String[] resultados = new String[nSegmentos];
        int quotient = nPares / nSegmentos;
        int remainder = nPares % nSegmentos;

        // --- Crear y encolar las DecodeTask ---
        for (int i = 0; i < nSegmentos; i++) {
            int paresPorSegmento = quotient + (i < remainder ? 1 : 0);
            int parDesde = i * quotient + Math.min(i, remainder);
            int parHasta = parDesde + paresPorSegmento;
            buffer.put(new DecodeTask(bytes, parDesde, parHasta, i, resultados));
        }

        // --- Encolar una PoisonPill por worker para que todos terminen ---
        for (int i = 0; i < nWorkers; i++) {
            buffer.put(new PoisonPill());
        }

        // --- Bloquear hasta que todos los workers terminen ---
        counter.esperarFin();

        // --- Ensamblar los resultados en orden y escribir el archivo de texto ---
        ensamblarDecode(resultados, archivoSalida); 
        System.out.printf("Archivo de texto escrito en '%s'%n", archivoSalida);
    }












    // -------------------------------------------------------------------------
    // Ensamblado encode 
    // -------------------------------------------------------------------------

    /**
     * Fusiona los runs de borde entre segmentos adyacentes, genera la lista final
     * de pares (codepoint, cantidad) y escribe el archivo binario de salida.
     * 
     * @param resultados   Array de ResultadoEncode, uno por segmento, en orden.
     * @param archivoSalida Ruta del archivo binario de salida.
     */
    static void ensamblarEncode(ResultadoEncode[] resultados, String archivoSalida)
            throws Exception {

        try (DataOutputStream dos = new DataOutputStream(
                new BufferedOutputStream(new FileOutputStream(archivoSalida)))) {
            for (ResultadoEncode r : resultados) {
                if (r.primerRun == null) continue; // segmento vacío: todo fue absorbido por el anterior
                dos.writeInt(r.primerRun[0]);
                dos.writeInt(r.primerRun[1]);
                for (int[] run : r.medio) {
                    dos.writeInt(run[0]);
                    dos.writeInt(run[1]);
                }
                if (r.ultimoRun != r.primerRun) {
                    dos.writeInt(r.ultimoRun[0]);
                    dos.writeInt(r.ultimoRun[1]);
                }
            }
        }
    }




    // -------------------------------------------------------------------------
    // Ensamblado decode 
    // -------------------------------------------------------------------------

    /**
     * Concatena los Strings de cada segmento en orden y escribe el archivo de texto
     * de salida en UTF-8.
     *
     * @param resultados    Array de Strings decodificados, uno por segmento, en orden.
     * @param archivoSalida Ruta del archivo de texto de salida.
     */
    static void ensamblarDecode(String[] resultados, String archivoSalida)
            throws Exception {
        StringBuilder sb = new StringBuilder();
        for (String segmento : resultados) {
            sb.append(segmento);
        }
        Files.writeString(Path.of(archivoSalida), sb.toString(), StandardCharsets.UTF_8);
    }
}