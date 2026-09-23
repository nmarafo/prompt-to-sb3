# 🧩 OKF Scratch: Open Knowledge Framework para Scratch 3.0 con IA

El estándar **OKF (Open Knowledge Framework) para Scratch 3.0** es una especificación didáctica y técnica abierta diseñada para permitir que agentes de Inteligencia Artificial (especialmente **Google NotebookLM**, Gemini, Claude y ChatGPT) transformen fuentes documentales, curriculares y narrativas en proyectos ejecutables de Scratch (`.sb3`) con total rigor pedagógico y determinismo técnico.

---

## 1. Anatomía Técnica de un Proyecto Scratch 3.0 (`.sb3`)

Un archivo con extensión `.sb3` no es un formato binario propietario cerrado; es técnicamente un contenedor comprimido estándar en formato **ZIP** que agrupa los siguientes componentes:

```text
proyecto.sb3 (archivo ZIP renombrado)
├── project.json                                 # Árbol JSON con la lógica, bloques, sprites y variables
├── cd21514d0531fdffb22204e0ec5ed84a.svg         # Activo: Fondo estándar (Stage backdrop)
├── bcf454acf82e4504149f7ffe07081dbc.svg         # Activo: Disfraz 1 del Gato (Sprite costume 1)
├── 0fb9be3e8397c983338cb71dc84d0b25.svg         # Activo: Disfraz 2 del Gato (Sprite costume 2)
├── 83a9787d4cb6f3b7632b4ddfebf74367.wav         # Activo: Sonido pop
└── 83c36d806dc92327b9e7049a565c6bff.wav         # Activo: Sonido miau (Meow)
```

### Reglas de Nomenclatura de Activos:
* Cada imagen (`.svg`, `.png`) o pista de audio (`.wav`, `.mp3`) se almacena en la raíz del archivo ZIP con el nombre formado por su identificador hash MD5 seguido de su extensión: `<md5ext>`.
* En `project.json`, los disfraces y sonidos referencian dicho archivo mediante los campos `assetId` (hash sin extensión) y `md5ext` (hash con extensión).
* Cuando se usan imágenes externas mediante el compilador web de **prompt-to-sb3**, el compilador descarga la imagen de la URL proporcionada, calcula su identificador o asigna un hash unívoco y la integra en el archivo ZIP empaquetado.

---

## 2. El Protocolo de 3 Fases con Google NotebookLM

Para garantizar la máxima calidad educativa y evitar errores de sintaxis en el JSON resultante, el flujo de trabajo en NotebookLM se organiza en tres fases consecutivas:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      PROTOCOLO DE 3 FASES: DE LA FUENTE A SCRATCH                      │
├────────────────────────┬───────────────────────────────┬───────────────────────────────┤
│  FASE 0: ASSETS WEB    │  FASE 1: GUION DIDÁCTICO      │  FASE 2: JSON COMPILADOR      │
├────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ En "Buscar nuevas      │ En el chat de NotebookLM:     │ En el chat de NotebookLM:     │
│ fuentes en la Web",    │ Analizar las fuentes cargadas │ Generar el JSON estructurado  │
│ localizar imágenes de  │ y estructurar la secuencia    │ con las URLs de assets y las  │
│ Wikimedia con URL      │ didáctica, diálogos, escenas  │ acciones pedagógicas (say,    │
│ directa (.svg/.png).   │ y retos interactivos.         │ move, ask, wait...).          │
└────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

---

## 3. Especificación del JSON Semántico (`prompt-to-sb3`)

El agente de IA debe generar un objeto JSON limpio y bien formateado que sigue esta estructura:

```json
{
  "name": "Nombre_Del_Proyecto",
  "backdrop": {
    "name": "Fondo_Principal",
    "url": "https://upload.wikimedia.org/.../fondo.jpg"
  },
  "costumes": [
    {
      "name": "Nombre_Personaje",
      "url": "https://upload.wikimedia.org/.../personaje.png"
    }
  ],
  "variables": {
    "puntos": 0,
    "vidas": 3
  },
  "actions": [
    { "type": "start" },
    { "type": "move", "x": -100, "y": 0 },
    { "type": "say", "text": "¡Hola! Bienvenidos a esta situación de aprendizaje." },
    { "type": "wait", "seconds": 2 },
    { "type": "ask", "question": "¿En qué año se publicó la obra?", "answer": "1887", "correct_say": "¡Exacto!", "incorrect_say": "Inténtalo de nuevo." }
  ]
}
```

### Catálogo de Acciones Semánticas Soportadas:

| Tipo (`type`) | Parámetros | Bloque Scratch Equivalente | Descripción |
| :--- | :--- | :--- | :--- |
| `start` | Ninguno (o `x`, `y`) | `event_whenflagclicked` | Inicia el programa al pulsar la Bandera Verde. |
| `say` | `text` (cadena), `seconds` (opcional) | `looks_sayforsecs` / `looks_say` | Muestra un bocadillo de diálogo con el texto educativo. |
| `think` | `text` (cadena), `seconds` (opcional) | `looks_thinkforsecs` | Muestra un bocadillo de pensamiento. |
| `wait` | `seconds` (número) | `control_wait` | Detiene la ejecución los segundos indicados. |
| `move` | `x` (núm), `y` (núm) o `steps` (núm) | `motion_gotoxy` o `motion_movesteps` | Posiciona o desplaza al personaje en el plano cartesiano. |
| `glide` | `seconds` (núm), `x` (núm), `y` (núm) | `motion_glidesecstoxy` | Desplazamiento suave a una coordenada. |
| `costume` | `name` (cadena) | `looks_switchcostumeto` | Cambia el disfraz del sprite. |
| `backdrop` | `name` (cadena) | `looks_switchbackdropto` | Cambia el fondo del escenario. |
| `ask` | `question`, `answer`, `correct_say`, `incorrect_say` | `sensing_askandwait` + `control_if_else` | Plantea una pregunta interactiva con retroalimentación. |
| `set_var` | `name` (cadena), `value` (núm o texto) | `data_setvariableto` | Asigna un valor a una variable. |
| `change_var` | `name` (cadena), `by` (núm) | `data_changevariableby` | Incrementa o decrementa una variable. |
| `repeat` | `times` (número), `actions` (array) | `control_repeat` | Bucle de repetición determinada. |
| `playsound` | `name` ("pop", "meow") | `sound_playuntildone` | Reproduce una pista de audio disponible. |

---

## 4. Prompts Oficiales para Google NotebookLM

### Fase 0: Prompt para "Buscar nuevas fuentes en la Web" (Assets Multimedia)
Copie y pegue esta instrucción en el buscador web de NotebookLM para encontrar recursos con enlace directo:

```text
Busca fuentes web en Wikimedia Commons, Wikipedia o repositorios educativos abiertos sobre [TEMA O PERSONAJE, ej: Benito Pérez Galdós / Sistema Solar / Ecosistemas Canarios] que proporcionen URLs directas de imágenes (.svg, .png o .jpg) y retratos de dominio público o licencia Creative Commons. Identifica:
1. Retrato o figura principal del personaje o elemento (URL directa).
2. Imagen representativa para el fondo o escenario (URL directa).
3. Breve descripción histórica o científica del elemento.
```

### Fase 1: Prompt de Guion Pedagógico
Copie y pegue esta instrucción en el chat general de NotebookLM una vez cargadas las fuentes:

```text
Analiza las fuentes seleccionadas y diseña un guion educativo interactivo para un proyecto de Scratch 3.0 sobre este tema.
Estructura la propuesta en:
1. Contexto curricular y competencia específica a desarrollar.
2. Personajes participantes y fondo de escenario (vincula las URLs encontradas en la Fase 0).
3. Secuencia didáctica en al menos 15 intervenciones (diálogos explicativos, movimientos y al menos 2 preguntas interactivas tipo quiz con retroalimentación para el alumnado).
```

### Fase 2: Master Prompt de Generación de JSON
Copie y pegue esta instrucción en el chat de NotebookLM tras validar el guion:

```text
Basándote en el guion didáctico y las fuentes anteriores, genera el código JSON para la herramienta Scratch Compiler Tool (prompt-to-sb3).

REGLAS OBLIGATORIAS:
1. Devuelve ÚNICAMENTE el bloque JSON crudo (sin introducciones, sin explicaciones posteriores ni rodeos).
2. Estructura requerida:
{
  "name": "Titulo_Del_Proyecto",
  "backdrop": { "name": "Nombre_Fondo", "url": "URL_DIRECTA_IMAGEN" },
  "costumes": [
    { "name": "Nombre_Personaje", "url": "URL_DIRECTA_IMAGEN" }
  ],
  "variables": { "puntos": 0 },
  "actions": [
    { "type": "start" },
    ...al menos 15 acciones combinando 'move', 'say', 'wait', 'ask', 'playsound'...
  ]
}
3. Asegúrate de incluir las URLs exactas de los disfraces y el fondo obtenidas de Wikimedia en la Fase 0.
```

---

## 5. Criterios Pedagógicos y Marco Curricular (LOMLOE)

El uso de **prompt-to-sb3** se articula en torno a:
1. **Competencia Digital (CD5 - Pensamiento Computacional)**: El alumnado comprende la algoritmia, el flujo de ejecución por bloques y la representación formal de datos.
2. **Diseño Universal para el Aprendizaje (DUA)**: Proporciona múltiples formas de representación (audio, visual, texto y narrativa interactiva) y expresión de saberes.
3. **Aprendizaje Activo y Gamificación**: Transformación de contenidos teóricos en experiencias interactivas donde el alumnado toma decisiones y recibe retroalimentación inmediata.
