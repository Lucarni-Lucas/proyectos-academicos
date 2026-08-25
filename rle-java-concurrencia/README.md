# Codificación RLE Concurrente

Este proyecto corresponde al **trabajo práctico de la materia Programación Concurrente (1S2026)**, desarrollado en **Java puro**, sin utilizar las abstracciones de alto nivel de `java.util.concurrent`.

El objetivo fue implementar un compresor/descompresor **RLE (Run-Length Encoding)** que procese archivos en paralelo, construyendo desde cero los mecanismos de sincronización: un buffer acotado productor-consumidor, un pool de threads propio y un contador de finalización, todos resueltos con **monitores** (`synchronized`, `wait()`, `notifyAll()`).

El desafío central no fue la compresión en sí, sino la **coordinación entre hilos**: repartir el archivo en segmentos, procesarlos concurrentemente y reconstruir el resultado en el orden correcto, fusionando los *runs* que quedan partidos en los bordes de cada segmento.

## 🧩 Componentes Principales

### Infraestructura Concurrente
- **`Buffer`** — Buffer circular acotado con capacidad configurable. Implementa el patrón productor-consumidor: bloquea al productor si está lleno y al consumidor si está vacío.
- **`ThreadPool`** — Pool de workers de tamaño configurable, instanciados y lanzados manualmente.
- **`RLEWorker`** — Thread consumidor. Toma tareas del buffer y las ejecuta en un loop hasta recibir la señal de terminación.
- **`WorkerCounter`** — Monitor que lleva la cuenta de workers activos y permite al hilo principal bloquearse hasta que todos hayan terminado.

### Terminación Ordenada
- **`PoisonPill`** — Tarea especial que señaliza el fin del trabajo. Se encola una por worker.
- **`PoisonException`** — Excepción lanzada por la `PoisonPill` para romper el loop del worker de forma limpia.

### Tareas de Procesamiento
- **`Task<T>`** — Clase abstracta base, con índice de orden para permitir el ensamblado posterior.
- **`EncodeTask`** — Codifica un segmento de codepoints y coordina con el segmento anterior para fusionar el *run* de borde.
- **`DecodeTask`** — Decodifica un rango de pares del archivo binario.
- **`ResultadoEncode`** — Estructura que separa el primer *run*, los *runs* intermedios y el último *run* de cada segmento, para permitir la fusión de bordes sin ambigüedad.

## ⚙️ Detalles de Implementación

### Manejo de Unicode
El archivo de entrada se lee en **UTF-8 y se convierte a codepoints**, no a `char`. Esto permite comprimir correctamente caracteres fuera del BMP (por ejemplo, emojis), que en Java ocuparían dos `char` y romperían el conteo de repeticiones.

### Formato Binario de Salida
El archivo codificado es una secuencia de pares `(codepoint, cantidad)`, cada uno de **8 bytes** (dos enteros de 4 bytes), escritos con `DataOutputStream`.

### Fusión de Runs en los Bordes
Al partir el archivo en segmentos, una secuencia repetida puede quedar cortada entre dos segmentos. Cada `EncodeTask` espera a que el segmento anterior publique su resultado, y si el último *run* del anterior coincide con su primer *run*, los fusiona. La espera se resuelve con un monitor sobre el array compartido de resultados, y la búsqueda retrocede sobre segmentos vacíos cuando corresponde.

### Particionado
La cantidad de segmentos nunca supera la cantidad de unidades disponibles (`min(nWorkers, total)`), y el resto de la división se reparte entre los primeros segmentos para que queden balanceados. Los archivos vacíos se manejan como caso borde explícito.

## 🔧 Ejecución del Proyecto

Se requiere **JDK 17 o superior**.

**Compilar:**
```bash
javac -d out src/rle/*.java
```

**Codificar:**
```bash
java -cp out rle.Main <archivoEntrada> <archivoSalida> encode <nWorkers> <tamBuffer>
```

**Decodificar:**
```bash
java -cp out rle.Main <archivoEntrada> <archivoSalida> decode <nWorkers> <tamBuffer>
```

**Ejemplo completo:**
```bash
java -cp out rle.Main test-files/mediano_alto.txt salida.bin encode 4 16
java -cp out rle.Main salida.bin recuperado.txt decode 4 16
```

| Parámetro | Descripción |
|---|---|
| `archivoEntrada` | Texto UTF-8 para `encode`, binario para `decode` |
| `archivoSalida` | Ruta del archivo generado |
| `modo` | `encode` o `decode` |
| `nWorkers` | Cantidad de threads del pool (entero positivo) |
| `tamBuffer` | Capacidad máxima del buffer (entero positivo) |

El programa reporta por consola el tiempo total de procesamiento, lo que permite comparar el rendimiento variando `nWorkers` y `tamBuffer`.

## 📁 Estructura

- `src/rle/` — Código fuente Java.
- `test-files/` — Archivos de prueba de distinto tamaño y densidad de repetición:
  - `pequeño_*`, `mediano_*`, `grande_*` — variantes por tamaño.
  - `*_alto` / `*_bajo` — alta o baja repetición de caracteres, para contrastar la efectividad del RLE.
  - `ejemplo_emoji.txt` — caso de prueba de codepoints fuera del BMP.
- `Informe_TP_RLE_v3.pdf` — Informe del trabajo práctico, con el análisis de diseño y las mediciones de rendimiento.

## 🚀 Objetivos Académicos

- Implementar el patrón productor-consumidor con monitores, sin usar colas concurrentes de la librería estándar.
- Construir un pool de threads y un mecanismo de terminación ordenada desde cero.
- Coordinar hilos que dependen de resultados parciales de otros, evitando *deadlocks* y *race conditions*.
- Resolver el problema de ensamblado ordenado de resultados producidos en paralelo.
- Medir y analizar el impacto de la cantidad de workers y del tamaño del buffer sobre el rendimiento.

Para más detalles sobre el diseño y las mediciones, consultar `Informe_TP_RLE_v3.pdf`.


## 👥 Colaboradores
Este proyecto fue desarrollado como un trabajo grupal. Gracias a mis compañeros por su dedicación:
* **Carnevale, Facundo** - [GitHub Profile](https://github.com/Jhanno3)
* **Torres, Nicolás** - [GitHub Profile](https://github.com/nicotorz)
