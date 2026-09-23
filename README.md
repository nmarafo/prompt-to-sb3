# 🧩 prompt-to-sb3 (OKF Scratch)

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/deed.es)
[![Framework: OKF](https://img.shields.io/badge/Framework-Open%20Knowledge%20Framework-blue.svg)](https://github.com/nmarafo)
[![Scratch: 3.0 Compatible](https://img.shields.io/badge/Scratch-3.0%20Compatible-orange.svg)](https://scratch.mit.edu)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen.svg)](https://nmarafo.github.io/prompt-to-sb3/)
[![Author: Norberto Martín Afonso](https://img.shields.io/badge/Author-Norberto%20Mart%C3%ADn%20Afonso-green.svg)](https://x.com/NorbertoMartnAf)

> 🚀 **Aplicación web en vivo**: Pueden acceder directamente al compilador sin instalación previa en **[https://nmarafo.github.io/prompt-to-sb3/](https://nmarafo.github.io/prompt-to-sb3/)**.

**prompt-to-sb3** es un ecosistema de código y conocimiento abierto basado en el estándar **Open Knowledge Framework (OKF)** que permite transformar documentos de investigación, situaciones de aprendizaje y consignas didácticas en proyectos interactivos ejecutables de **Scratch 3.0 (`.sb3`)**, utilizando **Google NotebookLM** y agentes de Inteligencia Artificial generativa.

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

La herramienta **prompt-to-sb3** resuelve la dificultad que tienen los modelos de lenguaje para generar cientos de punteros hexadecimales y matrices complejas de bloques de bajo nivel, proporcionando un **esquema semántico limpio** y un **compilador web en HTML/JS** que ensambla el archivo `.sb3` definitivo de forma automática.

---

## 🚀 Flujo de Trabajo en Google NotebookLM (Protocolo de 3 Fases)

Para construir un proyecto educativo en Scratch a partir de apuntes, libros de texto o investigaciones temáticas, sigan este protocolo paso a paso:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROTOCOLO DE 3 FASES CON NOTEBOOKLM                             │
├────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│  FASE 0: ASSETS WEB    │  FASE 1: GUION PEDAGÓGICO     │  FASE 2: MASTER PROMPT JSON   │
├────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ En "Buscar fuentes en  │ En el chat del cuaderno:      │ En el chat del cuaderno:      │
│ la Web", localizar     │ Estructurar la situación de   │ Generar el JSON estructurado  │
│ imágenes en Wikimedia  │ aprendizaje, la narrativa     │ con las URLs de los assets    │
│ con enlace directo.    │ y los retos de evaluación.    │ y las acciones interactivas.  │
└────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

---

### 🔍 Fase 0: Prompt para «Buscar nuevas fuentes en la Web» (Assets Multimedia)

En su cuaderno de Google NotebookLM, abran el panel lateral de fuentes (`+ Añadir fuentes`), hagan clic en **«Buscar fuentes en la Web»** y peguen la siguiente instrucción adaptando el tema entre corchetes:

```text
Busca imágenes y recursos visuales en Wikimedia Commons y repositorios de dominio público sobre [INTRODUZCA EL TEMA, PERSONAJE O CONTEXTO HISTÓRICO, ej: Benito Pérez Galdós en Gran Canaria / El Ciclo del Agua / Los Volcanes de Canarias].
Requisitos:
1. Necesito URLs directas y completas a imágenes (.svg, .png o .jpg), preferiblemente alojadas en upload.wikimedia.org.
2. Identifica un retrato o figura en plano recortado para el personaje principal (Sprite).
3. Identifica una imagen panorámica o escena de fondo para el escenario (Backdrop).
4. Presenta el resultado en una tabla con tres columnas: Elemento (Personaje/Fondo), Descripción pedagógica y URL directa de la imagen.
```

> **Resultado**: NotebookLM indexará esas páginas y guardará las URLs exactas de las imágenes en su memoria contextual para incorporarlas en el JSON de Scratch.

---

### 📝 Fase 1: Prompt de Guion Pedagógico e Instruccional

Una vez añadidas las fuentes teóricas y las fuentes web de imágenes, introduzcan en el chat de consultas de NotebookLM:

```text
Actúa como un Asesor Pedagógico experto en Tecnología Educativa y Diseño Universal para el Aprendizaje (DUA).
A partir de las fuentes que tenemos en este cuaderno, diseña la estructura completa de un proyecto interactivo en Scratch 3.0 sobre este tema.

Estructura el guion con los siguientes apartados:
1. Justificación Didáctica (etapa educativa, saberes básicos y competencia específica LOMLOE).
2. Personajes participantes (asociando las URLs directas de imágenes encontradas en la búsqueda web).
3. Fondo del escenario (asociando la URL del fondo encontrado).
4. Escaleta de Escenas y Diálogos: rediseña el contenido en forma de narrativa paso a paso (mínimo 15 intervenciones) donde el personaje guíe al alumnado, explique conceptos clave, plantee retos y realice preguntas interactivas tipo quiz con retroalimentación.
```

---

### ⚡ Fase 2: Master Prompt de Generación del JSON de Scratch

Cuando el guion esté ajustado a sus necesidades, soliciten a NotebookLM la conversión al esquema semántico del compilador:

```text
Basándote en el guion didáctico y las fuentes de este cuaderno, genera el código JSON para la herramienta Scratch Compiler Tool (prompt-to-sb3).

REGLAS TÉCNICAS OBLIGATORIAS:
1. Devuelve ÚNICAMENTE el bloque de código JSON crudo (sin texto introductorio, sin explicaciones ni comentarios).
2. Utiliza exactamente las URLs directas identificadas en la Fase 0 para 'backdrop' y 'costumes'.
3. Cumple estrictamente esta estructura:
{
  "name": "Titulo_Del_Proyecto",
  "backdrop": { "name": "NombreFondo", "url": "URL_DIRECTA_FONDO" },
  "costumes": [
    { "name": "NombrePersonaje", "url": "URL_DIRECTA_DISFRAZ" }
  ],
  "variables": { "puntos": 0 },
  "actions": [
    { "type": "start" },
    { "type": "move", "x": 0, "y": -40 },
    { "type": "say", "text": "¡Saludos a todas y todos!", "seconds": 3 },
    { "type": "wait", "seconds": 1 },
    { "type": "ask", "question": "¿Pregunta interactiva para el alumnado?", "answer": "respuesta", "correct_say": "¡Exacto!", "incorrect_say": "Respuesta incorrecta." },
    { "type": "playsound", "name": "pop" }
  ]
}
```

---

### 📥 Fase 3: Compilación y Carga en Scratch

1. Abran el archivo **`index.html`** en su navegador web (pueden abrirlo directamente con doble clic o alojarlo en GitHub Pages).
2. Peguen el JSON generado en el editor de la izquierda.
3. Hagan clic en el botón **Compilar y Descargar .sb3**.
4. Abran el editor oficial de Scratch en [scratch.mit.edu/projects/editor](https://scratch.mit.edu/projects/editor) o abran Scratch Desktop.
5. Vayan al menú superior: **Archivo > Subir desde tu ordenador** y seleccionen el archivo descargado.
6. ¡El proyecto se cargará con sus disfraces, fondos, diálogos, movimientos y preguntas interactivas listos para ejecutar!

---

## 🛠️ Estructura del Repositorio

```text
prompt-to-sb3/
├── LICENSE.md                           # Licencia CC BY-SA 4.0 con cláusula de atribución
├── README.md                            # Guía completa y documentación del ecosistema
├── .gitignore                           # Exclusiones de control de versiones
├── index.html                           # Aplicación web interactiva del compilador
├── style.css                            # Estilos y diseño responsivo institucional
├── compiler.js                          # Motor de compilación a Scratch 3.0 (.sb3)
├── assets/                              # Recursos base oficiales de Scratch (SVG y WAV)
│   ├── bcf454acf82e4504149f7ffe07081dbc.svg  # Gato de Scratch (Disfraz 1)
│   ├── 0fb9be3e8397c983338cb71dc84d0b25.svg  # Gato de Scratch (Disfraz 2)
│   ├── cd21514d0531fdffb22204e0ec5ed84a.svg  # Fondo blanco neutro
│   ├── 83a9787d4cb6f3b7632b4ddfebf74367.wav  # Pista de audio Pop
│   └── 83c36d806dc92327b9e7049a565c6bff.wav  # Pista de audio Miau
├── okf/                                 # Especificación Open Knowledge Framework
│   ├── OKF_PROMPT_TO_SB3.md             # Documento maestro para subir como fuente a NotebookLM
│   ├── catalogo_bloques_scratch.md      # Referencia técnica de opcodes y bloques Scratch VM
│   └── guia_prompts_notebooklm.md       # Banco de instrucciones y plantillas pedagógicas
├── schema/                              # Esquemas formales JSON Schema
│   ├── prompt_to_sb3_schema.json        # Validación de la especificación semántica
│   └── scratch3_project_schema.json     # Validación de project.json nativo
└── examples/                            # Proyectos de demostración listos para compilar
    ├── ejemplo_narrativa_galdos.json    # Benito Pérez Galdós en Gran Canaria (con imagen externa)
    ├── ejemplo_quiz_ciencias.json       # Cuestionario interactivo sobre el ciclo del agua
    └── ejemplo_movimiento_basico.json   # Animación y desplazamiento con disfraces nativos
```

---

## ⚖️ Licencia y Atribución Preceptiva

Este proyecto se distribuye bajo los términos de la licencia **[Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.es)**.

### Mención Obligatoria:
En cualquier redistribución, adaptación, integración en sistemas RAG, agentes o cuadernos de Inteligencia Artificial que utilicen los datos, esquemas o código de este repositorio, **debe incluirse la siguiente mención explícita**:

> *Basado en los proyectos de código y conocimiento abierto [prompt-to-sb3](https://github.com/nmarafo/prompt-to-sb3), [OpenDidactia](https://github.com/nmarafo/OpenDidactia) y [open-lex-edu](https://github.com/nmarafo/open-lex-edu), creados por **Norberto Martín Afonso**, distribuidos bajo licencia Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0).*
