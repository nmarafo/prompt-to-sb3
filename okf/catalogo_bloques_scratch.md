# 📚 Catálogo Técnico de Opcodes y Bloques de Scratch 3.0

Esta referencia técnica describe los principales códigos de operación (*opcodes*), estructuras de entradas (*inputs*) y campos (*fields*) del motor **Scratch VM 3.0** (`scratch-vm`), esenciales para agentes avanzados que deseen generar estructuras JSON nativas o verificar el ensamblado de `project.json`.

---

## 1. Bloques de Eventos (`event_*`)

### `event_whenflagclicked`
* **Descripción**: Punto de entrada al pulsar la bandera verde. Bloque de cabecera (*hat block*).
* **Campos**: Ninguno.
* **TopLevel**: `true`.
* **Estructura en `project.json`**:
```json
{
  "opcode": "event_whenflagclicked",
  "next": "ID_SIGUIENTE_BLOQUE",
  "parent": null,
  "inputs": {},
  "fields": {},
  "shadow": false,
  "topLevel": true,
  "x": 100,
  "y": 100
}
```

---

## 2. Bloques de Movimiento (`motion_*`)

### `motion_movesteps`
* **Descripción**: Mueve el sprite un número determinado de pasos en su dirección actual.
* **Entradas**: `STEPS` (número en formato `[1, [4, "10"]]`).

### `motion_gotoxy`
* **Descripción**: Posiciona al sprite en las coordenadas `(X, Y)`.
* **Entradas**:
  - `X`: `[1, [4, "0"]]`
  - `Y`: `[1, [4, "0"]]`

### `motion_glidesecstoxy`
* **Descripción**: Desplaza suavemente al sprite en un tiempo determinado.
* **Entradas**:
  - `SECS`: `[1, [4, "1"]]`
  - `X`: `[1, [4, "100"]]`
  - `Y`: `[1, [4, "50"]]`

---

## 3. Bloques de Apariencia (`looks_*`)

### `looks_say`
* **Descripción**: Muestra un bocadillo de diálogo sin temporizador.
* **Entradas**: `MESSAGE`: `[1, [10, "Texto a decir"]]`.

### `looks_sayforsecs`
* **Descripción**: Muestra un bocadillo durante un tiempo específico.
* **Entradas**:
  - `MESSAGE`: `[1, [10, "Mensaje"]]`
  - `SECS`: `[1, [4, "2"]]`

### `looks_think` y `looks_thinkforsecs`
* **Descripción**: Bocadillo de pensamiento. Mismas entradas que `looks_say` y `looks_sayforsecs`.

### `looks_switchcostumeto`
* **Descripción**: Cambia el disfraz actual.
* **Entradas**: `COSTUME`: `[1, "ID_SOMBRA_DISFRAZ"]` o menú de disfraces.

---

## 4. Bloques de Control (`control_*`)

### `control_wait`
* **Descripción**: Pausa la ejecución del hilo durante los segundos indicados.
* **Entradas**: `DURATION`: `[1, [5, "1"]]`.

### `control_repeat`
* **Descripción**: Bucle con número fijo de repeticiones.
* **Entradas**:
  - `TIMES`: `[1, [6, "10"]]`
  - `SUBSTACK`: `[2, "ID_PRIMER_BLOQUE_INTERNO"]`

### `control_forever`
* **Descripción**: Bucle infinito.
* **Entradas**: `SUBSTACK`: `[2, "ID_PRIMER_BLOQUE_INTERNO"]`.

---

## 5. Bloques de Sensores (`sensing_*`)

### `sensing_askandwait`
* **Descripción**: Muestra una pregunta con un campo de texto en la parte inferior de la pantalla y espera la respuesta del usuario.
* **Entradas**: `QUESTION`: `[1, [10, "¿Pregunta?"]]`.
* **Valor devuelto**: Se almacena en el bloque reportero `sensing_answer`.

---

## 6. Variables y Datos (`data_*`)

### `data_setvariableto`
* **Descripción**: Establece el valor de una variable.
* **Campos**: `VARIABLE`: `["nombre_variable", "id_variable"]`.
* **Entradas**: `VALUE`: `[1, [10, "valor"]]`.

### `data_changevariableby`
* **Descripción**: Suma o resta un valor numérico a una variable existente.
* **Campos**: `VARIABLE`: `["nombre_variable", "id_variable"]`.
* **Entradas**: `VALUE`: `[1, [4, "1"]]`.
