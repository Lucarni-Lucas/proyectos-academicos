package rle;

public class PoisonException extends RuntimeException {

    public PoisonException() {
        super("PoisonPill recibida: el worker debe terminar.");
    }
}
