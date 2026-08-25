package rle;

import java.nio.ByteBuffer;

public class DecodeTask extends Task<String> {

    private final byte[] bytes;
    private final int parDesde;
    private final int parHasta;
    private final String[] resultados;

    public DecodeTask(byte[] bytes, int parDesde, int parHasta, int indice, String[] resultados) {
        super(indice);
        this.bytes = bytes;
        this.parDesde = parDesde;
        this.parHasta = parHasta;
        this.resultados = resultados;
    }

    @Override
    public void run() {
        System.out.printf("[DecodeTask #%d] procesando pares [%d, %d)%n", orderIndex, parDesde, parHasta);

        StringBuilder sb = new StringBuilder(); // StringBuilder permite emojis, Character no.

        ByteBuffer bb = ByteBuffer.wrap(bytes, parDesde * 8, (parHasta - parDesde) * 8);

        for (int p = parDesde; p < parHasta; p++) {
            int codepoint = bb.getInt();
            int cantidad  = bb.getInt();
            for (int j = 0; j < cantidad; j++) {
                sb.appendCodePoint(codepoint);
            }
        }

        resultados[orderIndex] = sb.toString();
        System.out.printf("[DecodeTask #%d] finalizado%n", orderIndex);
    }
}
