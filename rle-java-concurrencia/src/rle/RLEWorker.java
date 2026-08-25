package rle;

public class RLEWorker extends Thread {

    private final Buffer buffer;
    private final WorkerCounter counter;

    /**
     * Thread worker del pool de procesamiento RLE.
     * 
     * @param buffer  Buffer compartido del que se tomarán las Tasks.
     * @param counter Monitor que registra cuántos workers siguen activos.
     */
    public RLEWorker(Buffer buffer, WorkerCounter counter) {
        this.buffer = buffer;
        this.counter = counter;
    }

    /**
     * Ejecuta el ciclo de procesamiento del worker: toma tareas del buffer y las ejecuta.
     * El ciclo termina cuando se recibe una PoisonPill, lo que lanza una PoisonException para salir del loop.
     */
    @Override
    public void run() {
        try {
            while (true) {
                Task<?> task = buffer.take();
                task.run(); 
            }
        } catch (PoisonException e) {
            // --- Terminación normal: se recibió la señal de fin de trabajo ---
        } catch (InterruptedException e) {
            // --- Interrupción externa inesperada: restaurar el flag de interrupción ---
            Thread.currentThread().interrupt();
        } finally {
            // --- Siempre notificar que este worker terminó, incluso ante errores ---
            counter.workerTermino();
        }
    }
}