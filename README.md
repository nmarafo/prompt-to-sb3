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

## 🚀 Flujo de Trabajo Optimizado en Google NotebookLM (Protocolo en 2 Pasos)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROTOCOLO OPTIMIZADO EN 2 PASOS CON NOTEBOOKLM                  │
├────────────────────────────────────────────────┬───────────────────────────────────────┤
│  PASO 1: BÚSQUEDA WEB CON DEEP RESEARCH       │  PASO 2: MASTER PROMPT UNIVERSAL      │
├────────────────────────────────────────────────┼───────────────────────────────────────┤
│ En "Buscar fuentes en la Web", activar         │ En el chat del cuaderno:              │
│ Deep Research para generar el informe con      │ Generar el JSON estructurado crudo    │
│ las URLs directas e incorporarlo como fuente.  │ con mecánicas, balanceo y las URLs.   │
└────────────────────────────────────────────────┴───────────────────────────────────────┘
```

---

### 🔍 Paso 1: Búsqueda de Fuentes y Assets con Deep Research

En su cuaderno de Google NotebookLM, abran el panel lateral de fuentes (`+ Añadir fuentes`) y seleccionen **«Buscar fuentes en la Web»**:

> ⚠️ **Paso Preceptivo: Seleccionar Deep Research**:
> Asegúrense de **marcar la opción `Deep Research` (Investigación Profunda)** antes de pulsar buscar. Deep Research rastreará la red y elaborará un **informe exhaustivo con las URLs directas verificadas** de Wikimedia Commons.
> 
> **Añadan ese informe resultante como fuente activa al cuaderno**. Este paso es imprescindible para que el modelo no invente enlaces inexistentes y utilice las URLs exactas de los recursos en el JSON de salida.

Peguen la siguiente instrucción en la barra de búsqueda web:

```text
Actúa como un Documentalista Multimedia. Realiza una búsqueda profunda (Deep Research) en Wikimedia Commons y repositorios abiertos sobre: [TEMA O PERSONAJES, ej: Benito Pérez Galdós / Naves espaciales y meteoritos / Obras del Museo del Prado].

Objetivo: Localizar recursos gráficos de acceso abierto con URLs directas de imagen para un proyecto interactivo en Scratch 3.0.
Requisitos técnicos estrictos:
1. Solo URLs directas a archivos de imagen (.jpg, .png con fondo transparente o .svg), preferiblemente en upload.wikimedia.org.
2. Identifica al menos:
   - De 2 a 4 Sprites (personajes, objetos móviles o botones con fondo limpio).
   - De 2 a 3 Backdrops (escenarios panorámicos de fondo).
3. Elabora un informe documental exhaustivo con una tabla final con las columnas:
   | Nombre_Identificador | Tipo (Sprite / Backdrop) | Descripción Visual | URL Directa de Imagen |
```

---

### ⚡ Paso 2: Master Prompt Universal (Chat de NotebookLM)

Una vez añadido el informe de Deep Research como fuente documental, peguen la siguiente instrucción en el chat del cuaderno para obtener el JSON completo listo para compilar:

```text
Actúa como un Desarrollador Senior de Scratch 3.0.
A partir de las fuentes documentales de este cuaderno y del informe de Deep Research con las imágenes, genera el código JSON para la herramienta Scratch Compiler Tool (prompt-to-sb3).

CONFIGURACIÓN DEL PROYECTO:
- Tipo: [visor_interactivo | videojuego | animacion | simulacion] sobre [TEMA]
- Distribuye los Sprites en coordenadas (x, y) equilibradas para evitar que se superpongan en pantalla.

REGLAS TÉCNICAS ESTRICTAS:
1. Responde ÚNICAMENTE con el bloque JSON crudo (sin texto antes ni después).
2. Utiliza exactamente las URLs directas de imagen del informe de Deep Research para 'costumes' y 'backdrops'.
3. Inicia cada script con un disparador válido: 'when_flag_clicked', 'when_key', 'when_this_sprite_clicked' o 'when_receive'.
4. Acciones permitidas: 'go_to', 'changex', 'changey', 'bounce_edge', 'say' (con 'duration'), 'show', 'hide', 'next_backdrop', 'broadcast', 'change_variable' (con 'variable' y 'val'), 'wait' y 'forever'.

Formato de ejemplo:
{
  "name": "Proyecto_Scratch",
  "category": "visor_interactivo",
  "backdrops": [
    { "name": "Fondo_1", "url": "URL_DIRECTA_FONDO_1" },
    { "name": "Fondo_2", "url": "URL_DIRECTA_FONDO_2" }
  ],
  "variables": { "puntos": 0, "diapositiva": 1 },
  "sprites": [
    {
      "name": "Personaje",
      "costumes": [{ "name": "Disfraz", "url": "URL_IMAGEN" }],
      "x": -100, "y": 0,
      "scripts": [
        [
          { "type": "when_flag_clicked" },
          { "type": "go_to", "x": -100, "y": 0 },
          { "type": "say", "text": "¡Bienvenidos!", "duration": 4 }
        ],
        [
          { "type": "when_key", "key": "space" },
          { "type": "next_backdrop" },
          { "type": "change_variable", "variable": "puntos", "val": 10 }
        ]
      ]
    }
  ]
}
```

---

### 🎮 Variante Rápida para Videojuegos Arcade

Si desean generar directamente un **videojuego interactivo con mecánicas arcade**, pueden utilizar esta formulación en el chat:

```text
Actúa como un Programador de Videojuegos en Scratch 3.0.
A partir de las fuentes y el informe de Deep Research, genera el JSON para un videojuego arcade sobre [TEMA]:
1. Objeto 'Jugador': controlado por flechas izquierda/derecha ('when_key', 'changex', 'bounce_edge').
2. Objeto 'Obstaculo': cae verticalmente en bucle continuo ('forever', 'changey', 'wait').
3. Variables: 'puntos' y 'vidas'.
4. Asigna las URLs de Wikimedia Commons para el fondo y los sprites.
5. Devuelve ÚNICAMENTE el código JSON crudo conforme a la estructura de prompt-to-sb3.
```

---

### 📥 Paso 3: Compilación y Carga en Scratch

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
