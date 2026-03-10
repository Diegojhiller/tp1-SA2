
## Qué hace este archivo

El archivo contiene:

### HTML

Define la estructura de la página:

- título
- caja de texto
- botón

### CSS

Define el estilo de la página:

- colores
- tamaño del texto
- alineación

### JavaScript

Controla la interacción del usuario:

- Detecta cuando el usuario presiona la tecla **Enter**.
- Muestra una ventana emergente con el texto ingresado.
- Cambia los colores del fondo y del texto al hacer clic en el botón.

---

## Cómo ejecutar esta versión

1. Abrir la carpeta `tp1.sa2`
2. Hacer doble clic en:

3. El navegador abrirá la página y ya estará funcionando.

No es necesario instalar ningún programa adicional.

---

# 4. Implementación 2 – JavaScript con servidor web (Node.js)

En esta versión el sitio web es servido por un servidor web creado con **Node.js**.

## Archivos principales

---

## servidor.js

Este archivo crea un servidor HTTP usando Node.js.

Sus funciones principales son:

- Crear un servidor web.
- Escuchar peticiones del navegador.
- Leer el archivo `index.html`.
- Enviar el contenido del HTML al navegador.

El servidor se ejecuta en el puerto: 3000

---

## server

Este archivo contiene exactamente la misma interfaz que la implementación anterior:

- caja de texto
- botón para cambiar colores
- código JavaScript para manejar los eventos

La diferencia es que ahora el archivo es entregado por un **servidor web**.

---
## Cómo ejecutar esta versión

### Requisitos

Tener instalado: Node.js

---

### Pasos

1. Abrir la terminal en la carpeta `server`.

2. Ejecutar el siguiente comando:
    node server.js


3. Aparecerá el siguiente mensaje:

Servidor ejecutándose en http://localhost:3000

4. Abrir el navegador y entrar a:

http://localhost:3000

