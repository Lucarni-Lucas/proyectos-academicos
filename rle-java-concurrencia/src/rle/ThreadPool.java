package rle;

public class ThreadPool {

    private final RLEWorker[] workers;

    /**
     * Pool de RLEWorkers. Se encarga de instanciar los workers pero no los inicia. Para iniciarlos, llamar a iniciar().
     *
     * @param cantidad Número de RLEWorkers a crear.
     * @param buffer   Buffer compartido del que cada worker tomará Tasks.
     * @param counter  WorkerCounter compartido para registrar la finalización de cada worker.
     */
    public ThreadPool(int cantidad, Buffer buffer, WorkerCounter counter) {
        workers = new RLEWorker[cantidad];
        for (int i = 0; i < cantidad; i++) {
            workers[i] = new RLEWorker(buffer, counter);
        }
    }

    /**
     * Inicia todos los workers.
     */
    public void iniciar() {
        for (RLEWorker worker : workers) {
            worker.start();
        }
    }
}