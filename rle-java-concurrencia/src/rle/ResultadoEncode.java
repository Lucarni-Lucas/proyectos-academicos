package rle;

public class ResultadoEncode {

    public final int[] primerRun;  // {codepoint, cantidad} del primer run del segmento
    public final int[][] medio;    // runs intermedios, ya cerrados definitivamente
    public final int[] ultimoRun;  // {codepoint, cantidad} del último run del segmento
    public final int indice;       // posición del segmento, para mantener orden al ensamblar

    public ResultadoEncode(int[] primerRun, int[][] medio, int[] ultimoRun, int indice) {
        this.primerRun = primerRun;
        this.medio = medio;
        this.ultimoRun = ultimoRun;
        this.indice = indice;
    }
}
