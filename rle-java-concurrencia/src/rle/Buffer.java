package rle;

public class Buffer {

    private final Task<?>[] slots;
    private final int capacity;
    private int head;  // index del próximo elemento a consumir
    private int tail;  // index donde se insertará el próximo elemento
    private int count; // cantidad de elementos actualmente en el buffer

    /**
     * @param capacity Capacidad máxima del buffer (configurable desde Main)
     */
    public Buffer(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("La capacidad del buffer debe ser mayor a 0");
        }
        this.capacity = capacity;
        this.slots = new Task[capacity];
        this.head = 0;
        this.tail = 0;
        this.count = 0;
    }

    /**
     * Inserta una tarea en el buffer.
     * Bloquea al productor si el buffer está lleno hasta que haya espacio.
     *
     * @param task La tarea a insertar (puede ser EncodeTask, DecodeTask o PoisonPill)
     * @throws InterruptedException si el hilo es interrumpido mientras espera
     */
    public synchronized void put(Task<?> task) throws InterruptedException {
        // Espera mientras el buffer esté lleno
        while (count == capacity) {
            wait();
        }
        slots[tail] = task;
        tail = (tail + 1) % capacity;
        count++;
        // Notificar a los consumidores que hay un nuevo elemento disponible
        notifyAll();
    }

    /**
     * Extrae una tarea del buffer.
     * Bloquea al consumidor si el buffer está vacío hasta que haya elementos.
     *
     * Retorna la siguiente tarea disponible en el buffer, respetando el orden.
     * @throws InterruptedException si el hilo es interrumpido mientras espera
     */
    public synchronized Task<?> take() throws InterruptedException {
        // Esperar mientras el buffer está vacío
        while (count == 0) {
            wait();
        }
        Task<?> task = slots[head];
        slots[head] = null;
        head = (head + 1) % capacity;
        count--;
        // Notificar a los productores que hay espacio disponible
        notifyAll();
        return task;
    }

    /** Retorna la cantidad de elementos en el buffer */
    public synchronized int size() {
        return count;
    }

    /** Indica si el buffer está vacío */
    public synchronized boolean isEmpty() {
        return count == 0;
    }
}