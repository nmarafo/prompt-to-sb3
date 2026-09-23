# 💡 Guía Universal y Prompts Optimizados para Google NotebookLM y Scratch 3.0

Esta guía reúne las plantillas de instrucciones **optimizadas con técnicas avanzadas de prompt engineering** para que **Google NotebookLM** genere proyectos interactivos impecables en Scratch 3.0 (videojuegos, visores interactivos, animaciones y simuladores) sin errores de sintaxis ni activos omitidos.

---

## 🎯 El Flujo Optimizado en 2 Pasos

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          FLUJO OPTIMIZADO NOTEBOOKLM ➔ SCRATCH                         │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│  PASO 1: BÚSQUEDA WEB (DEEP RESEARCH)  │  PASO 2: CHAT DE NOTEBOOKLM (MASTER PROMPT)   │
├────────────────────────────────────────┼───────────────────────────────────────────────┤
│ En "+ Añadir fuentes > Buscar en Web", │ En el chat del cuaderno:                     │
│ activar DEEP RESEARCH y pegar el       │ Pegar el Master Prompt Optimizador para       │
│ Prompt de Documentación de Assets.     │ generar directamente el JSON definitivo       │
│ ➔ Añadir el informe como fuente.      │ con mecánicas, sprites y URLs vinculadas.     │
└────────────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## 🔍 Paso 1: Prompt Optimizado para Búsqueda Web con Deep Research

En su cuaderno de **Google NotebookLM**, abran el panel lateral de **Fuentes** (`+ Añadir fuentes > Buscar fuentes en la Web`), **seleccionen la opción `Deep Research` (Investigación Profunda)** y peguen esta instrucción:

```text
Actúa como un Documentalista Multimedia y Diseñador de Recursos. Realiza una búsqueda profunda (Deep Research) en Wikimedia Commons y repositorios abiertos sobre: [INTRODUZCA TEMA O PERSONAJES, ej: Benito Pérez Galdós en Gran Canaria y Madrid / Naves espaciales y meteoritos / Fauna marina].

Objetivo: Localizar recursos gráficos de acceso abierto con URLs directas de imagen para un proyecto interactivo en Scratch 3.0.
Requisitos técnicos estrictos:
1. Necesito ÚNICAMENTE URLs directas a archivos de imagen (.jpg, .png con fondo transparente o .svg), alojadas preferiblemente en upload.wikimedia.org.
2. Identifica al menos:
   - De 2 a 4 elementos para personajes, objetos móviles o botones (Sprites).
   - De 2 a 3 escenarios panorámicos en alta resolución para fondos de pantalla (Backdrops).
3. Elabora un informe documental exhaustivo que concluya con una tabla resumen con las siguientes columnas:
   | Nombre_Identificador | Tipo (Sprite / Backdrop) | Descripción Visual | URL Directa de Imagen |
```

> ⚠️ **Acción Inmediata Obligatoria**: Una vez que Deep Research termine su investigación, **añadan el informe generado como fuente activa a su cuaderno de NotebookLM**. Esto garantiza que el modelo tenga las URLs directas cargadas en su memoria para el siguiente paso.

---

## ⚡ Paso 2: Master Prompt Universal Optimizador (Chat de NotebookLM)

Una vez que el cuaderno cuente con el informe de Deep Research entre sus fuentes, peguen en el chat de consultas la siguiente instrucción adaptada:

```text
Actúa como un Diseñador y Desarrollador Senior de Software en Scratch 3.0.
A partir de las fuentes documentales de este cuaderno y del informe de Deep Research con los enlaces de imágenes, crea un proyecto interactivo completo en formato JSON compatible con Scratch Compiler Tool (prompt-to-sb3).

CONFIGURACIÓN DEL PROYECTO:
- Nombre: [Nombre representativo sin espacios, ej: Visor_Galdos_Gran_Canaria o Space_Arcade_Defender]
- Categoría: [visor_interactivo | videojuego | animacion | simulacion]
- Tema: [Breve descripción de la experiencia interactiva y su dinámica]

REGLAS TÉCNICAS ESTRICTAS:
1. Responde ÚNICAMENTE con un bloque de código JSON válido, sin texto introductorio, sin saludos y sin explicaciones antes o después del JSON.
2. Extrae las URLs directas de imagen exactamente como aparecen en el informe de Deep Research (de upload.wikimedia.org) y asígnalas a 'backdrops' y a los 'costumes' de cada sprite.
3. Distribuye los Sprites en coordenadas (x, y) equilibradas para evitar que se superpongan en el centro del escenario (ej: izquierda x: -120, centro x: 0, derecha x: 120).
4. Cada script dentro de 'scripts' debe iniciarse con un disparador válido: 'when_flag_clicked', 'when_key' (con su tecla), 'when_this_sprite_clicked' o 'when_receive'.
5. Utiliza acciones soportadas: 'go_to', 'changex', 'changey', 'bounce_edge', 'say' (con 'duration'), 'show', 'hide', 'next_backdrop', 'next_costume', 'broadcast', 'change_variable' (con 'variable' y 'val'), 'wait' y bucles 'forever'.

ESTRUCTURA JSON REQUERIDA:
{
  "name": "Nombre_Del_Proyecto",
  "category": "visor_interactivo",
  "backdrops": [
    { "name": "Nombre_Fondo_1", "url": "URL_DIRECTA_FONDO_1" },
    { "name": "Nombre_Fondo_2", "url": "URL_DIRECTA_FONDO_2" }
  ],
  "variables": { "puntos": 0, "diapositiva": 1 },
  "sprites": [
    {
      "name": "Nombre_Sprite",
      "costumes": [ { "name": "Disfraz_1", "url": "URL_DIRECTA_IMAGEN" } ],
      "x": -100, "y": 0, "size": 100,
      "scripts": [
        [
          { "type": "when_flag_clicked" },
          { "type": "go_to", "x": -100, "y": 0 },
          { "type": "say", "text": "Texto descriptivo o de bienvenida...", "duration": 4 }
        ],
        [
          { "type": "when_key", "key": "space" },
          { "type": "next_backdrop" },
          { "type": "change_variable", "variable": "diapositiva", "val": 1 },
          { "type": "change_variable", "variable": "puntos", "val": 10 }
        ]
      ]
    }
  ]
}
```

---

## 🎮 Variante Rápida para Videojuegos

Si desean crear un **videojuego con mecánicas arcade**, pueden utilizar este prompt directo en el chat de NotebookLM:

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

## 🛠️ Consejos para Evitar Fallos en el Output de NotebookLM

1. **Evitar comillas dobles sin escapar**: Si el diálogo del personaje contiene comillas, el prompt exige que el JSON sea válido.
2. **Cero texto fuera del JSON**: La instrucción *"Responde ÚNICAMENTE con un bloque de código JSON"* previene que NotebookLM agregue resúmenes conversacionales que impidan compilar directamente con un solo clic.
3. **Persistencia de URLs**: Al incorporar el informe de Deep Research como fuente documental activa, NotebookLM no inventa enlaces falsos ni usa enlaces HTML rotos, sino que copia textualmente las URLs de `upload.wikimedia.org`.
