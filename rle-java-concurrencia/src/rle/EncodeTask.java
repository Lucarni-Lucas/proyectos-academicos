package rle;

import java.util.ArrayList;
import java.util.List;

public class EncodeTask extends Task<ResultadoEncode> {

    private final int[] codepoints;
    private final int desde;
    private final int hasta;
    private final ResultadoEncode[] resultados;

    public EncodeTask(int[] codepoints, int desde, int hasta, int indice, ResultadoEncode[] resultados) {
        super(indice);
        this.codepoints = codepoints;
        this.desde = desde;
        this.hasta = hasta;
        this.resultados = resultados;
    }

    @Override
    public void run() {
        System.out.printf("[EncodeTask #%d] procesando codepoints [%d, %d)%n", orderIndex, desde, hasta);

        // --- Calcular runs del segmento propio ---
        List<int[]> runs = new ArrayList<>();
        int currentCp = codepoints[desde];
        int count = 1;
        for (int i = desde + 1; i < hasta; i++) {
            if (codepoints[i] == currentCp) {
                count++;
            } else {
                runs.add(new int[]{currentCp, count});
                currentCp = codepoints[i];
                count = 1;
            }
        }
        runs.add(new int[]{currentCp, count});

        // --- Coordinar con el segmento anterior para fusionar el borde ---
        if (orderIndex > 0) {

            // Esperar a que el segmento anterior haya escrito su resultado
            synchronized (resultados) {
                while (resultados[orderIndex - 1] == null) {
                    try {
                        resultados.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        resultados[orderIndex] = new ResultadoEncode(null, new int[0][], null, orderIndex);
                        resultados.notifyAll();
                        return;
                        // ResultadoEnCode vacio para indicar que falló la tarea, y notificar a cualquier otro hilo que esté esperando.
                    }
                }
            }

            // Buscar el último run efectivo hacia atrás (por si algún segmento previo quedó vacío)
            int[] prevLast = null;
            for (int j = orderIndex - 1; j >= 0; j--) {
                if (resultados[j].ultimoRun != null) {
                    prevLast = resultados[j].ultimoRun;
                    break;
                }
            }

            // Si el último run del anterior tiene el mismo codepoint que el nuestro primero, fusionar
            if (prevLast != null && !runs.isEmpty() && prevLast[0] == runs.get(0)[0]) {
                prevLast[1] += runs.get(0)[1];
                runs.remove(0);
            }
        }

        // --- Construir ResultadoEncode y publicarlo ---
        int[] primerRun;
        int[] ultimoRun;
        int[][] medio;

        if (runs.isEmpty()) {
            // Todo fue absorbido por el segmento anterior
            primerRun = null;
            ultimoRun = null;
            medio = new int[0][];
        } else if (runs.size() == 1) {
            primerRun = runs.get(0);
            ultimoRun = primerRun; // mismo objeto → ensamblarEncode no lo escribe dos veces
            medio = new int[0][];
        } else {
            primerRun = runs.get(0);
            ultimoRun = runs.get(runs.size() - 1);
            medio = runs.subList(1, runs.size() - 1).toArray(new int[0][]);
        }

        synchronized (resultados) {
            resultados[orderIndex] = new ResultadoEncode(primerRun, medio, ultimoRun, orderIndex);
            resultados.notifyAll();
        }

        System.out.printf("[EncodeTask #%d] finalizado → %d runs%n", orderIndex, runs.size());
    }
}
