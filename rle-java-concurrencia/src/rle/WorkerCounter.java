package rle;

public class WorkerCounter {

    private int activos;

    /**
     * Monitor que lleva la cuenta de los workers activos. Inicializado con la cantidad total de workers lanzados.
     *  
     * @param cantidad Número total de RLEWorkers que serán lanzados.
     */
    public WorkerCounter(int cantidad) {
        this.activos = cantidad;
    }

    /**
     * Bloquea al hilo llamante hasta que todos los workers hayan llamado a workerTermino().
     *
     * @throws InterruptedException si el hilo es interrumpido mientras espera.
     */
    public synchronized void esperarFin() throws InterruptedException {
        while (activos > 0) {
            wait();
        }
    }

    /**
     * Registra que un worker terminó su ejecución. Cuando el último worker llama a este método, despierta al hilo bloqueado en esperarFin().
     */
    public synchronized void workerTermino() {
        activos--;
        if (activos == 0) {
            notifyAll();
        }
    }
}