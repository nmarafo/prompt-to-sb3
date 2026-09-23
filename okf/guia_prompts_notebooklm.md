# 💡 Guía de Prompts Pedagógicos para Google NotebookLM y Scratch

Esta guía reúne las plantillas de instrucciones optimizadas para utilizar **Google NotebookLM** como motor de generación didáctica para proyectos interactivos de Scratch 3.0.

---

## 🎯 Flujo de Trabajo Recomendado

```text
1. Crear Cuaderno en NotebookLM
        │
        ▼
2. FASE 0: Buscar Assets Multimedia en la Web (Wikimedia / Enlaces Directos)
        │
        ▼
3. FASE 1: Diseñar el Guion Didáctico y Narrativo con las Fuentes
        │
        ▼
4. FASE 2: Generar el JSON Estructurado para prompt-to-sb3
        │
        ▼
5. Pegar en el Compilador Web y Descargar el .sb3
        │
        ▼
6. Abrir en Scratch (scratch.mit.edu -> Archivo -> Subir desde tu ordenador)
```

---

## 🔍 Fase 0: Prompt para "Buscar nuevas fuentes en la Web" (Assets de Imagen y Sonido)

En la interfaz de **Google NotebookLM**, abra el panel lateral de **Fuentes** (`+ Añadir fuentes`) y seleccione la opción **«Buscar fuentes en la Web»** (o introduzca la consulta en la barra de búsqueda web del cuaderno). 

Pegue el siguiente prompt adaptando el tema entre corchetes:

```text
Busca imágenes y recursos visuales en Wikimedia Commons y repositorios de dominio público sobre [INTRODUZCA AQUÍ EL TEMA, PERSONAJES O CONTEXTO HISTÓRICO, ej: Benito Pérez Galdós en Las Palmas de Gran Canaria].
Requisitos:
1. Necesito URLs directas y completas a imágenes (.svg, .png o .jpg), preferiblemente alojadas en upload.wikimedia.org.
2. Identifica un retrato o figura en plano recortado para el personaje principal (Sprite).
3. Identifica una imagen panorámica o escena de fondo para el escenario (Backdrop).
4. Presenta el resultado en una tabla con tres columnas: Elemento (Personaje/Fondo), Descripción pedagógica y URL directa de la imagen.
```

> **Consejo didáctico**: NotebookLM indexará las páginas web encontradas como nuevas fuentes del cuaderno. Además, conservará las URLs directas de las imágenes en su memoria de contexto para utilizarlas de inmediato en la Fase 2.

---

## 📝 Fase 1: Prompt de Guion Pedagógico e Instruccional

Una vez que las fuentes documentales y las fuentes web de imágenes estén añadidas a su cuaderno de NotebookLM, pegue en el chat de consultas la siguiente instrucción:

```text
Actúa como un Asesor Pedagógico experto en Tecnología Educativa y Diseño Universal para el Aprendizaje (DUA).
A partir de las fuentes que tenemos en este cuaderno, diseña la estructura completa de un proyecto interactivo en Scratch 3.0 sobre este tema.

Estructura el guion con los siguientes apartados:
1. Título y Justificación Didáctica (etapa educativa, vinculación con saberes básicos y competencia específica).
2. Personajes participantes (asociando las URLs de imágenes encontradas en la búsqueda web).
3. Fondo del escenario (asociando la URL del fondo encontrado).
4. Escaleta de Escenas y Diálogos: rediseña el contenido en forma de narrativa paso a paso (mínimo 15 intervenciones) donde el personaje guíe al alumnado, explique conceptos clave, realice preguntas interactivas y valide los aprendizajes.
```

---

## ⚡ Fase 2: Master Prompt para Generar el JSON de Scratch

Cuando el guion pedagógico esté aprobado y ajustado a sus objetivos de aula, solicite a NotebookLM la conversión formal al esquema de **prompt-to-sb3**:

```text
Excelente. Ahora transforma el guion didáctico en el JSON requerido por la herramienta Scratch Compiler Tool (prompt-to-sb3).

INSTRUCCIONES TÉCNICAS ESTRICTAS:
1. Devuelve ÚNICAMENTE el bloque de código JSON sin ningún texto explicativo previo ni posterior.
2. Utiliza exactamente las URLs de las imágenes identificadas en las fuentes web para el fondo y los disfraces.
3. Estructura el JSON con las siguientes claves:
   - "name": Título representativo del proyecto.
   - "backdrop": { "name": "NombreFondo", "url": "URL_del_fondo" }
   - "costumes": [ { "name": "NombrePersonaje", "url": "URL_de_la_figura" } ]
   - "variables": { "puntos": 0 }
   - "actions": Lista de acciones en orden cronológico usando tipos soportados:
     * {"type": "start"}
     * {"type": "move", "x": 0, "y": -50}
     * {"type": "say", "text": "...", "seconds": 3}
     * {"type": "wait", "seconds": 1}
     * {"type": "ask", "question": "¿...?", "answer": "...", "correct_say": "¡Muy bien!", "incorrect_say": "No es correcto."}
     * {"type": "playsound", "name": "pop"}
4. Asegúrate de que las cadenas de texto no contengan saltos de línea sin escapar y que la sintaxis JSON sea 100% válida.
```

---

## 🛠️ Validación y Resolución de Problemas Frecuentes

* **La imagen no carga en el compilador**:
  - Compruebe que la URL apunta directamente a un archivo de imagen (`.png`, `.jpg`, `.svg`) y no a la página HTML de Wikimedia. En Wikimedia, haga clic derecho sobre la imagen -> *Copiar dirección de la imagen* (suele comenzar por `https://upload.wikimedia.org/...`).
  - Si una imagen externa tiene restricciones de servidor (CORS), el compilador web le notificará en la consola y aplicará automáticamente el disfraz clásico del gato de Scratch para que el archivo `.sb3` nunca quede inutilizable.
* **El archivo `.sb3` no abre en Scratch**:
  - Asegúrese de subirlo desde Scratch mediante el menú **Archivo > Cargar desde tu ordenador**. No intente hacer doble clic en el archivo descargado si su sistema operativo no tiene Scratch Desktop asociado.
