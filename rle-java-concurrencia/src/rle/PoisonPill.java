package rle;

public class PoisonPill extends Task<Void> {

    /**
     * Señal de terminación para un RLEWorker.
     * Cuando un worker ejecuta esta tarea, lanza PoisonException para salir de su loop.
     */
    public PoisonPill() {
        super(-1);
    }

    @Override
    public void run() {
        throw new PoisonException();
    }
}
