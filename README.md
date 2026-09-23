# 🧩 prompt-to-sb3 (OKF Scratch)

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/deed.es)
[![Framework: OKF](https://img.shields.io/badge/Framework-Open%20Knowledge%20Framework-blue.svg)](https://github.com/nmarafo)
[![Scratch: 3.0 Compatible](https://img.shields.io/badge/Scratch-3.0%20Compatible-orange.svg)](https://scratch.mit.edu)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen.svg)](https://nmarafo.github.io/prompt-to-sb3/)
[![Author: Norberto Martín Afonso](https://img.shields.io/badge/Author-Norberto%20Mart%C3%ADn%20Afonso-green.svg)](https://x.com/NorbertoMartnAf)

> 🚀 **Aplicación web en vivo**: Pueden acceder directamente al compilador sin instalación previa en **[https://nmarafo.github.io/prompt-to-sb3/](https://nmarafo.github.io/prompt-to-sb3/)**.

**prompt-to-sb3** es un ecosistema universal de código y conocimiento abierto basado en el estándar **Open Knowledge Framework (OKF)** que permite transformar documentos de investigación, especificaciones de **videojuegos, visores interactivos, galerías multimedia, animaciones o simulaciones** en proyectos ejecutables de **Scratch 3.0 (`.sb3`)**, utilizando **Google NotebookLM** y agentes de Inteligencia Artificial generativa.

---

## 🕹️ Ámbitos de Aplicación y Versatilidad

El estándar y el motor de compilación no están restringidos al diseño didáctico; proporcionan soporte integral para:

* 🎮 **Videojuegos de Acción y Arcade**:
  - Eventos de teclado (`when_key` con flechas direccionales o barra espaciadora).
  - Bucles de juego continuos (`forever`) para gravedad, desplazamientos y patrullajes.
  - Rebote automático en los límites de la pantalla (`bounce_edge`).
  - Marcadores de puntuación, vidas y cronómetros (`variables`).
  - Múltiples objetos interactuando (`sprites`): Jugador, Obstáculos y Coleccionables.

* 🖼️ **Visores Interactivos y Galerías**:
  - Navegación entre obras, fotografías o diapositivas (`next_backdrop` o `next_costume`).
  - Botones interactivos de avance o retroceso accionados por clic (`when_clicked`).
  - Rótulos y paneles informativos dinámicos (`say`, `think`).

* 🎬 **Animaciones y Cinemáticas**:
  - Desplazamientos cartesianos coordinados (`move`, `glide`, `wait`).
  - Comunicación entre personajes mediante mensajes (`broadcast` y `when_receive`).

* 🧪 **Simulaciones y Experiencias Didácticas**:
  - Cuestionarios interactivos con entrada de texto (`ask`).
  - Conmutación de estados y visibilidad (`show`, `hide`, `set_size`).

---

## 🏛️ ¿Cómo funciona un archivo de Scratch 3.0 (`.sb3`)?

Cuando ustedes descargan un proyecto desde el editor oficial de Scratch, obtienen un archivo con extensión `.sb3`. Si cambian manualmente el nombre de esa extensión a `.zip` y lo descomprimen, observarán la arquitectura interna de la plataforma:

```text
proyecto_scratch.sb3  ──(renombrar a .zip)──►  [Archivo Comprimido ZIP]
                                                ├── project.json
                                                ├── cd21514d0531fdffb22204e0ec5ed84a.svg  (Fondo)
                                                ├── bcf454acf82e4504149f7ffe07081dbc.svg  (Gato - Disfraz 1)
                                                ├── 0fb9be3e8397c983338cb71dc84d0b25.svg  (Gato - Disfraz 2)
                                                ├── 83a9787d4cb6f3b7632b4ddfebf74367.wav  (Sonido Pop)
                                                └── 83c36d806dc92327b9e7049a565c6bff.wav  (Sonido Miau)
```

1. **`project.json`**: Es el archivo neurálgico del proyecto. Contiene la lista de *targets* (el escenario `Stage` y los personajes `Sprites`), las variables, las listas y un árbol de bloques interconectados mediante punteros de identificación alfanuméricos (`opcode`, `next`, `parent`, `inputs`).
2. **Archivos multimedia**: Cada disfraz gráfico (`.svg`, `.png`) o sonido (`.wav`, `.mp3`) se guarda con el nombre de su resumen criptográfico hash **MD5** seguido de su extensión.

La herramienta **prompt-to-sb3** resuelve la dificultad que tienen los modelos de lenguaje para generar cientos de punteros hexadecimales y matrices complejas de bloques de bajo nivel, proporcionando un **esquema semántico universal** y un **compilador web en HTML/JS** que ensambla el archivo `.sb3` definitivo de forma automática.

---

## 🚀 Flujo de Trabajo en Google NotebookLM (Protocolo Universal de 3 Fases)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROTOCOLO UNIVERSAL DE 3 FASES CON NOTEBOOKLM                   │
├────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│  FASE 0: ASSETS WEB    │  FASE 1: DISEÑO DEL PROYECTO  │  FASE 2: MASTER PROMPT JSON   │
├────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ En "Buscar fuentes en  │ En el chat del cuaderno:      │ En el chat del cuaderno:      │
│ la Web", localizar     │ Diseñar las mecánicas (juego, │ Generar el JSON estructurado  │
│ imágenes en Wikimedia  │ visor, controles y variables) │ universal con las URLs de     │
│ con enlace directo.    │ a partir de las fuentes.      │ assets y acciones interactivas│
└────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

---

### 🔍 Fase 0: Prompt para «Buscar nuevas fuentes en la Web» (Assets Multimedia)

En su cuaderno de Google NotebookLM, abran el panel lateral de fuentes (`+ Añadir fuentes`), hagan clic en **«Buscar fuentes en la Web»** y peguen la siguiente instrucción adaptando el tema entre corchetes:

```text
Busca imágenes y recursos visuales en Wikimedia Commons y repositorios de acceso público sobre [INTRODUZCA TEMA, ej: Naves espaciales y meteoritos / Obras de arte / Paisajes / Personajes].
Requisitos técnicos:
1. Necesito URLs directas a archivos de imagen (.png con fondo transparente o .svg, o fotografías .jpg panorámicas), alojadas preferiblemente en upload.wikimedia.org.
2. Identifica:
   - Imágenes para personajes, objetos o botones (Sprites).
   - Imágenes panorámicas para escenarios o diapositivas (Backdrops).
3. Presenta los resultados en una tabla clara: Elemento, Uso sugerido en Scratch y URL directa de la imagen.
```

---

### 📝 Fase 1: Prompt de Diseño del Proyecto

En el chat de NotebookLM, introduzcan:

```text
Actúa como un Diseñador y Programador de Software Interactivo en Scratch 3.0.
A partir de las fuentes y elementos gráficos de este cuaderno, diseña la arquitectura de un proyecto [TIPO: videojuego / visor interactivo / simulación / animación]:
1. Objetivo y reglas de la experiencia.
2. Objetos participantes (Sprites) y fondos (Backdrops) vinculando las URLs obtenidas en la Fase 0.
3. Controles de usuario (teclas de flechas, espacio o clics con el ratón).
4. Variables de estado ('puntos', 'vidas', 'diapositiva' o 'tiempo').
```

---

### ⚡ Fase 2: Master Prompt de Generación del JSON Universal

```text
Basándote en el diseño anterior, genera el código JSON universal para la herramienta Scratch Compiler Tool (prompt-to-sb3).

REGLAS TÉCNICAS OBLIGATORIAS:
1. Devuelve ÚNICAMENTE el bloque JSON crudo (sin texto antes ni después).
2. Para videojuegos o proyectos multi-objeto, utiliza el array 'sprites' con sus 'scripts' o 'actions'.
3. Para visores o galerías, puedes usar un array en 'backdrop' con múltiples imágenes y la acción 'next_backdrop'.
4. Formato de ejemplo (Videojuego/Visor):
{
  "name": "Mi_Proyecto_Scratch",
  "category": "videojuego",
  "backdrop": { "name": "Fondo", "url": "URL_DIRECTA_FONDO" },
  "variables": { "puntos": 0, "vidas": 3 },
  "sprites": [
    {
      "name": "Jugador",
      "costumes": [{ "name": "Disfraz", "url": "URL_IMAGEN" }],
      "x": 0, "y": -120,
      "scripts": [
        [ { "type": "when_key", "key": "right arrow" }, { "type": "changex", "dx": 15 }, { "type": "bounce_edge" } ],
        [ { "type": "when_key", "key": "left arrow" }, { "type": "changex", "dx": -15 }, { "type": "bounce_edge" } ]
      ]
    }
  ]
}
```

---

### 📥 Fase 3: Compilación y Carga en Scratch

1. Abran el compilador web en **[https://nmarafo.github.io/prompt-to-sb3/](https://nmarafo.github.io/prompt-to-sb3/)** o abran `index.html` localmente.
2. Peguen el JSON generado en el editor.
3. Hagan clic en el botón **Compilar y Descargar .sb3**.
4. Abran el editor oficial de Scratch en [scratch.mit.edu/projects/editor](https://scratch.mit.edu/projects/editor) o abran Scratch Desktop.
5. Vayan a **Archivo > Subir desde tu ordenador** y seleccionen el archivo descargado.

---

## 🛠️ Estructura del Repositorio

```text
prompt-to-sb3/
├── LICENSE.md                           # Licencia CC BY-SA 4.0 con cláusula de atribución
├── README.md                            # Guía completa y documentación del ecosistema
├── .gitignore                           # Exclusiones de control de versiones
├── index.html                           # Aplicación web interactiva del compilador
├── style.css                            # Estilos y diseño responsivo
├── compiler.js                          # Motor universal de compilación Scratch 3.0 (.sb3)
├── assets_bundle.js                     # Recursos base embebidos para ejecución 100% offline
├── examples_bundle.js                   # Ejemplos precargados offline
├── assets/                              # Recursos base oficiales de Scratch (SVG y WAV)
├── okf/                                 # Especificación Open Knowledge Framework
│   ├── OKF_PROMPT_TO_SB3.md             # Documento maestro universal para NotebookLM
│   ├── catalogo_bloques_scratch.md      # Catálogo técnico de opcodes Scratch VM
│   └── guia_prompts_notebooklm.md       # Prompts para videojuegos, visores y animaciones
├── schema/                              # Esquemas formales JSON Schema
│   ├── prompt_to_sb3_schema.json        # Validación de la especificación semántica universal
│   └── scratch3_project_schema.json     # Validación de project.json nativo
└── examples/                            # Proyectos de demostración listos para compilar
    ├── ejemplo_videojuego_arcade.json   # Videojuego espacial (Nave, asteroides y puntos)
    ├── ejemplo_visor_galeria.json       # Visor interactivo de obras y fotografías
    ├── ejemplo_narrativa_galdos.json    # Historia interactiva (Benito Pérez Galdós)
    ├── ejemplo_quiz_ciencias.json       # Cuestionario interactivo con variables
    └── ejemplo_movimiento_basico.json   # Animación elemental y disfraces nativos
```

---

## ⚖️ Licencia y Atribución Preceptiva

Este proyecto se distribuye bajo los términos de la licencia **[Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.es)**.

### Mención Obligatoria:
En cualquier redistribución, adaptación, integración en sistemas RAG, agentes o cuadernos de Inteligencia Artificial que utilicen los datos, esquemas o código de este repositorio, **debe incluirse la siguiente mención explícita**:

> *Basado en los proyectos de código y conocimiento abierto [prompt-to-sb3](https://github.com/nmarafo/prompt-to-sb3), [OpenDidactia](https://github.com/nmarafo/OpenDidactia) y [open-lex-edu](https://github.com/nmarafo/open-lex-edu), creados por **Norberto Martín Afonso**, distribuidos bajo licencia Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0).*
