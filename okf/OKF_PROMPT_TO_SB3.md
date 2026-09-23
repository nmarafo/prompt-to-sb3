# 🧩 OKF Scratch: Open Knowledge Framework Universal para Scratch 3.0 con IA

El estándar **OKF (Open Knowledge Framework) Universal para Scratch 3.0** es una especificación estructurada y flexible diseñada para permitir que agentes de Inteligencia Artificial (especialmente **Google NotebookLM**, Gemini, Claude y ChatGPT) transformen cualquier tipo de consigna, documentación o idea en proyectos completos y funcionales de **Scratch 3.0 (`.sb3`)**: **videojuegos, visores interactivos, galerías multimedia, animaciones, simuladores o aplicaciones interactivas**.

---

## 1. Tipologías y Casos de Uso Soportados

El estándar no está restringido al ámbito didáctico formal; cubre cualquier diseño algorítmico interactivo:

1. **Videojuegos Arcade y Acción**:
   - Mecánicas de movimiento mediante eventos de teclado (`when_key` con flechas o WASD).
   - Bucles principales continuos de juego (`forever`) para desplazamiento, gravedad o patrullaje.
   - Rebote automático en los bordes de la pantalla (`bounce_edge`).
   - Sistemas de puntuación, vidas y temporizadores mediante variables (`puntos`, `vidas`, `tiempo`).
   - Múltiples objetos independientes (`sprites`): Jugador, Obstáculos/Enemigos y Coleccionables.

2. **Visores Multimedia y Galerías**:
   - Navegación visual por diapositivas, catálogos o fondos fotográficos (`next_costume`, `next_backdrop`).
   - Botones interactivos de avance, retroceso o zoom accionados al hacer clic (`when_clicked`).
   - Carteles de texto, etiquetas y leyendas explicativas (`say`, `think`).

3. **Animaciones, Cinemáticas e Historias Interactivas**:
   - Planos cronológicos coordinados con desplazamientos y esperas (`glide`, `move`, `wait`).
   - Comunicación entre personajes mediante mensajes globales (`broadcast` y `when_receive`).

4. **Simulaciones y Proyectos Interactivos Generales**:
   - Preguntas al usuario con entrada de texto (`ask`).
   - Conmutación de visibilidad de elementos en pantalla (`show`, `hide`, `set_size`).

---

## 2. Estructura General del JSON (`prompt-to-sb3`)

El agente puede generar dos modalidades de arquitectura según la complejidad del proyecto:

### Modalidad A: Proyecto Multi-Objeto (Videojuegos y Visores Avanzados)
Ideal cuando interactúan varios personajes o existen botones de interfaz:

```json
{
  "name": "Space_Defender_Game",
  "category": "videojuego",
  "description": "Juego arcade donde la nave esquiva meteoritos y acumula puntos",
  "backdrop": {
    "name": "Galaxia",
    "url": "https://upload.wikimedia.org/.../galaxia.jpg"
  },
  "variables": {
    "puntos": 0,
    "vidas": 3
  },
  "sprites": [
    {
      "name": "NaveJugador",
      "costumes": [{ "name": "Nave", "url": "https://.../nave.png" }],
      "x": 0,
      "y": -120,
      "scripts": [
        [
          { "type": "when_key", "key": "right arrow" },
          { "type": "changex", "dx": 15 },
          { "type": "bounce_edge" }
        ],
        [
          { "type": "when_key", "key": "left arrow" },
          { "type": "changex", "dx": -15 },
          { "type": "bounce_edge" }
        ]
      ]
    },
    {
      "name": "Meteorito",
      "costumes": ["costume1"],
      "x": 0,
      "y": 140,
      "actions": [
        { "type": "start" },
        {
          "type": "forever",
          "actions": [
            { "type": "changey", "dy": -8 },
            { "type": "wait", "seconds": 0.05 }
          ]
        }
      ]
    }
  ]
}
```

### Modalidad B: Objeto Principal Directo (Visores Sencillos, Animaciones y Narrativas)
Estructura plana y compacta:

```json
{
  "name": "Visor_Arte_Canario",
  "category": "visor",
  "backdrop": [
    { "name": "Obra1", "url": "https://upload.wikimedia.org/.../cuadro1.jpg" },
    { "name": "Obra2", "url": "https://upload.wikimedia.org/.../cuadro2.jpg" }
  ],
  "costumes": ["costume1"],
  "actions": [
    { "type": "start" },
    { "type": "say", "text": "Haga clic en la pantalla o pulse espacio para cambiar de obra." },
    { "type": "when_key", "key": "space" },
    { "type": "next_backdrop" },
    { "type": "playsound", "name": "pop" }
  ]
}
```

---

## 3. Catálogo Universal de Acciones

| Categoría | Tipo (`type`) | Parámetros | Bloque Scratch 3.0 |
| :--- | :--- | :--- | :--- |
| **Eventos** | `start` / `flag` | `x`, `y` | Al presionar bandera verde |
| | `when_key` / `key` | `key` ("space", "up arrow", "down arrow", etc.) | Al presionar tecla |
| | `when_clicked` / `click` | Ninguno | Al hacer clic en este sprite |
| | `broadcast` | `message` | Enviar mensaje global |
| | `when_receive` | `message` | Al recibir mensaje global |
| **Movimiento** | `move` | `x`, `y` (ir a posición) o `steps` (avanzar) | `motion_gotoxy` o `motion_movesteps` |
| | `changex` / `changey` | `dx` / `dy` | Sumar a X o Y |
| | `setx` / `sety` | `x` / `y` | Fijar X o Y |
| | `bounce_edge` | Ninguno | Si toca un borde, rebotar |
| | `turn_right` / `left` | `degrees` | Girar grados |
| | `point_direction` | `direction` (90, -90, 0, 180) | Apuntar en dirección |
| | `glide` | `seconds`, `x`, `y` | Deslizar a posición |
| **Apariencia** | `say` / `think` | `text`, `seconds` | Decir / Pensar |
| | `show` / `hide` | Ninguno | Mostrar / Ocultar objeto |
| | `costume` | `name` | Cambiar disfraz a |
| | `next_costume` | Ninguno | Siguiente disfraz |
| | `backdrop` | `name` | Cambiar fondo a |
| | `next_backdrop` | Ninguno | Siguiente fondo |
| | `set_size` / `change_size` | `size` / `by` | Fijar o cambiar tamaño % |
| **Control** | `forever` | `actions` (array) | Bucle continuo `por siempre` |
| | `repeat` | `times`, `actions` (array) | Repetir N veces |
| | `wait` | `seconds` | Esperar segundos |
| **Variables** | `set_var` | `name`, `value` | Fijar variable |
| | `change_var` | `name`, `by` | Sumar a variable |
| **Interacción**| `ask` | `question` | Preguntar y esperar |
| **Sonido** | `playsound` | `name` ("pop", "meow") | Tocar sonido |

---

## 4. Metodología Deep Research en Google NotebookLM

Para garantizar que el modelo disponga de URLs reales, accesibles y verificadas de los recursos multimedia:

1. **Selección de Deep Research**: Al iniciar la búsqueda de recursos en la web dentro de NotebookLM, es imprescindible seleccionar la opción **Deep Research** (Investigación Profunda).
2. **Generación del Informe**: Deep Research rastrea repositorios abiertos (como Wikimedia Commons) y compila un informe documental exhaustivo que contiene las tablas con las URLs directas de las imágenes (`.png`, `.svg`, `.jpg`).
3. **Incorporación como Fuente**: Dicho informe generado debe añadirse explícitamente como **fuente** (*source*) del cuaderno de NotebookLM.
4. **Inclusión en el Output**: Al redactar el Master Prompt para generar el JSON, el modelo cruzará el diseño interactivo con el informe de Deep Research, incorporando con total precisión las URLs de los disfraces (`costumes`) y fondos (`backdrop`) en el archivo final.
