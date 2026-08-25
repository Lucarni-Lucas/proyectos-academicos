package rle;

public abstract class Task<T> implements Runnable {

    protected final int orderIndex;
    protected T result;

    /**
     * @param orderIndex Posición de esta tarea en la secuencia total del archivo
     */
    public Task(int orderIndex) {
        this.orderIndex = orderIndex;
        this.result = null;
    }

    /** @return El índice de orden de esta tarea */
    public int getOrderIndex() {
        return orderIndex;
    }

    /** @return El resultado del procesamiento (null si aún no terminó) */
    public T getResult() {
        return result;
    }

    /**
     * Ejecuta la codificación o decodificación del segmento asignado.
     * Implementado por las clases que implementen esta clase abstracta, EncodeTask y DecodeTask.
     */
    @Override
    public abstract void run();
}
