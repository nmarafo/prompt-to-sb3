# 💡 Guía Universal de Prompts para Google NotebookLM y Scratch 3.0

Esta guía proporciona las plantillas de instrucciones optimizadas para utilizar **Google NotebookLM** y agentes de IA como generadores de cualquier tipología de proyecto en Scratch: **videojuegos, visores de imágenes o catálogos, simuladores, animaciones y experiencias interactivas**.

---

## 🔍 Fase 0: Búsqueda de Fuentes y Assets en la Web con Deep Research

Para que el modelo localice URLs directas funcionales y fiables de imágenes y fondos:

1. En **Google NotebookLM** (o Gemini), abran el panel de **Fuentes** (`+ Añadir fuentes > Buscar fuentes en la Web`).
2. **IMPORTANTE**: Asegúrense de **seleccionar la opción `Deep Research` (Investigación Profunda)** antes de lanzar la consulta. Esto activará un rastreo exhaustivo en la red y generará un **informe estructurado con todas las URLs directas** de los recursos multimedia encontrados.
3. Una vez generado dicho informe, **añádanlo como fuente al cuaderno de NotebookLM**. Al figurar entre las fuentes activas, el agente podrá consultar directamente las URLs e incluirlas de manera exacta en el JSON de salida.

Peguen la siguiente instrucción en la búsqueda:

```text
Busca imágenes y recursos visuales en Wikimedia Commons y repositorios de acceso público sobre [INTRODUZCA TEMA, ej: Naves espaciales y meteoritos / Obras de arte / Paisajes naturales / Personajes históricos].
Requisitos técnicos:
1. Necesito URLs directas a archivos de imagen (.png con fondo transparente o .svg, o fotografías .jpg panorámicas), alojadas preferiblemente en upload.wikimedia.org.
2. Identifica:
   - Imágenes para personajes, objetos o botones (Sprites).
   - Imágenes panorámicas para escenarios o diapositivas (Backdrops).
3. Presenta los resultados en una tabla clara: Elemento, Uso sugerido en Scratch y URL directa de la imagen.
```

---

## 🎮 Variante A: Prompts para Creación de Videojuegos

### 1. Prompt de Diseño del Juego
```text
Actúa como un Diseñador y Programador de Videojuegos en Scratch 3.0.
A partir de las fuentes y elementos gráficos seleccionados, diseña las mecánicas para un videojuego con las siguientes características:
1. Nombre y Objetivo del juego (ej: esquivar obstáculos, recoger ítems o llegar a una meta).
2. Controles del jugador (teclas de flechas o espacio).
3. Comportamiento de los obstáculos o enemigos (movimiento en bucle 'forever', rebote en bordes).
4. Variables del juego: 'puntos', 'vidas' o 'tiempo'.
5. Condiciones de victoria y derrota.
```

### 2. Master Prompt JSON para Videojuegos
```text
Genera el código JSON para la herramienta Scratch Compiler Tool (prompt-to-sb3) que implemente el videojuego diseñado.

REGLAS TÉCNICAS:
1. Devuelve ÚNICAMENTE el bloque JSON crudo (sin texto explicativo).
2. Utiliza la estructura multi-sprite ('sprites') con los objetos 'Jugador' y 'Obstaculo' o 'Item'.
3. Incluye los eventos de control por teclado ('when_key'), bucles 'forever' y cambios en coordenadas ('changex', 'changey', 'bounce_edge').
4. Formato:
{
  "name": "Nombre_Del_Juego",
  "category": "videojuego",
  "backdrop": { "name": "Fondo", "url": "URL_IMAGEN" },
  "variables": { "puntos": 0, "vidas": 3 },
  "sprites": [
    {
      "name": "Jugador",
      "costumes": [{ "name": "Personaje", "url": "URL_DISFRAZ" }],
      "x": 0, "y": -120,
      "scripts": [
        [ { "type": "when_key", "key": "right arrow" }, { "type": "changex", "dx": 15 }, { "type": "bounce_edge" } ],
        [ { "type": "when_key", "key": "left arrow" }, { "type": "changex", "dx": -15 }, { "type": "bounce_edge" } ]
      ]
    },
    {
      "name": "Enemigo",
      "costumes": ["costume1"],
      "x": 0, "y": 140,
      "actions": [
        { "type": "start" },
        { "type": "forever", "actions": [ { "type": "changey", "dy": -8 }, { "type": "wait", "seconds": 0.05 } ] }
      ]
    }
  ]
}
```

---

## 🖼️ Variante B: Prompts para Creación de Visores y Galerías Interactivas

### 1. Prompt de Diseño del Visor
```text
Actúa como un Diseñador de Experiencias Interactivas en Scratch 3.0.
A partir de las fuentes documentales o artísticas de este cuaderno, estructura un visor interactivo de contenidos:
1. Lista de imágenes/obras y sus correspondientes descripciones o datos relevantes.
2. Modo de navegación: cambio de diapositiva al pulsar la tecla espacio, al hacer clic sobre el escenario o mediante botones 'Siguiente' / 'Anterior'.
3. Textos explicativos en bocadillos o carteles para cada escena.
```

### 2. Master Prompt JSON para Visores
```text
Genera el código JSON para la herramienta Scratch Compiler Tool (prompt-to-sb3) que implemente el visor interactivo.

REGLAS TÉCNICAS:
1. Devuelve ÚNICAMENTE el bloque JSON crudo.
2. Asocia la lista de imágenes a los fondos del escenario ('backdrop') o a los disfraces del objeto ('costumes').
3. Utiliza eventos 'when_key' (ej: "space" o "right arrow") o 'when_clicked' combinados con 'next_backdrop' o 'next_costume' y bocadillos 'say'.
4. Formato:
{
  "name": "Visor_Interactivo",
  "category": "visor",
  "backdrop": [
    { "name": "Diapositiva1", "url": "URL_IMAGEN_1" },
    { "name": "Diapositiva2", "url": "URL_IMAGEN_2" }
  ],
  "costumes": ["costume1"],
  "actions": [
    { "type": "start" },
    { "type": "say", "text": "Bienvenidos al visor interactivo. Pulsen espacio o hagan clic para navegar." },
    { "type": "when_key", "key": "space" },
    { "type": "next_backdrop" },
    { "type": "playsound", "name": "pop" }
  ]
}
```

---

## 🎬 Variante C: Animaciones, Cinemáticas y Simulaciones Generales

Para cualquier otro proyecto (animaciones con movimiento secuencial, preguntas interactivas, simulaciones físicas):

```text
Genera el código JSON para Scratch Compiler Tool (prompt-to-sb3).
Estructura una secuencia de acciones cronológicas empleando tipos como 'start', 'move', 'glide', 'say', 'wait', 'ask', 'playsound' y 'change_var'.
Devuelve ÚNICAMENTE el bloque de código JSON sin ningún texto añadido.
```
