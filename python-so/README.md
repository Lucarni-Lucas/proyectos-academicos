# Sistema Operativo - Simulación

Este proyecto consiste en la implementación de un **sistema operativo altamente conceptual**, desarrollado con fines **educativos** en la materia **Sistemas Operativos**.  
El objetivo principal fue modelar los componentes fundamentales de un sistema operativo y su interacción, sin apegarse a implementaciones reales o modernas, sino priorizando la **comprensión teórica** de los conceptos.

El sistema no busca ser funcional ni eficiente, sino servir como una **abstracción clara** de los mecanismos internos de un SO.


## ⚠️ Alcance del Proyecto

Este proyecto **no representa** cómo funcionan los sistemas operativos actuales a nivel industrial.  
Todas las implementaciones son **simplificadas**, generales y orientadas al aprendizaje de conceptos clave.


## 🧩 Componentes Principales

El sistema operativo conceptual incluye los siguientes módulos:

### Gestión de Interrupciones
- **InterruptionVector**, con las interrupciones:
  - `Kill`
  - `New`
  - `IOIN`
  - `IOOUT`
  - `TIMEOUT`
  - `PAGEFAULT`

### Gestión de Procesos
- **PCB (Process Control Block)**
- **PCB Table**
- **Ready Queue**
- **Loader**
- **Dispatcher**
- **Schedulers**:
  - `FCFS (First Come First Served)`
  - `Priority No Expropiativo`
  - `Priority Expropiativo`
  - `Round Robin`

### Gestión de Memoria
- **Memory Manager**

### Sistema de Archivos
- **File System**

### Núcleo del Sistema
- **Kernel**, encargado de coordinar los distintos componentes

### Visualización
- **Gantt Chart**, utilizado para representar gráficamente la planificación de procesos


## 🧠 Estructura General

El proyecto se encuentra organizado en módulos que representan cada subsistema del sistema operativo, permitiendo una separación clara de responsabilidades y una mejor comprensión del flujo de ejecución.

Cada componente interactúa de forma controlada con el kernel, simulando el comportamiento general de un sistema operativo.


## 🚀 Objetivos Académicos

- Comprender el ciclo de vida de un proceso.
- Analizar distintos algoritmos de planificación.
- Modelar la gestión de interrupciones.
- Entender el rol del kernel como coordinador del sistema.
- Representar visualmente la ejecución de procesos.
- Aplicar conceptos teóricos en una implementación práctica y simplificada.


## 🔧 Ejecución del Proyecto

Para ejecutar/analizar el proyecto se requiere:
1. Se requiere de Python13 y un IDE a elección (como VSCode o PyCharm).
2. Ejecutar main.py e intercambiar los escenarios de prueba predefinidos.
3. Analizar el comportamiento del sistema mediante el Gantt Chart.


## 👥 Colaboradores
Este proyecto fue desarrollado como un trabajo grupal. Gracias a mis compañeros por su dedicación:
* **Nasr, Cristian** - [GitHub Profile](https://github.com/nasrcristian)
* **Sofarelli, Thiago** - [GitLab Profile](https://gitlab.com/thiagosofarelli)