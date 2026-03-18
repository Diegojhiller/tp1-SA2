# TP-3 - Registro de Alumnos con Backend en Node.js

## Descripción
Este proyecto implementa una aplicación web para registrar alumnos con nombre, edad y nota.

La página se sirve desde un backend en Node.js y los datos se guardan en memoria del servidor, separados por usuario mediante una cookie de sesión. De esta forma:

- Cada persona ve solamente sus propios alumnos.
- Si cierra y vuelve a abrir el navegador, sus datos siguen disponibles.
- El servidor es accesible desde cualquier IP de la red local.

## Estructura
- index.html: interfaz del formulario y lista de alumnos.
- main.js: lógica del frontend, consumo de API y renderizado de datos.
- server.js: servidor HTTP, API REST, manejo de sesión por cookie y servido de archivos estáticos.
- package.json: configuración mínima del proyecto y script de inicio.

## Cómo funciona el código

### 1) Frontend
En main.js se hace lo siguiente:

1. Al cargar la página, hace una petición GET a /api/alumnos para traer los datos guardados para esa sesión.
2. Al presionar Guardar Alumno, envía un POST a /api/alumnos con los datos del alumno.
3. Al presionar Limpiar Datos, envía un DELETE a /api/alumnos.
4. Después de cada respuesta exitosa, vuelve a dibujar la lista y recalcula el promedio.

### 2) Backend
En server.js se implementa:

1. Servidor HTTP nativo de Node.js (sin frameworks).
2. Escucha en 0.0.0.0 para aceptar conexiones desde otras máquinas.
3. Cookie sid para identificar cada navegador.
4. Almacenamiento en memoria con un Map:
   - clave: sid
   - valor: array de alumnos de esa sesión
5. API REST en /api/alumnos:
   - GET: devuelve la lista de alumnos de la sesión.
   - POST: valida y agrega un alumno.
   - DELETE: borra todos los alumnos de la sesión.
6. Servido estático de index.html y main.js.

## Requisitos
- Node.js 18 o superior.

## Cómo correr el proyecto
Desde la carpeta TP-3 ejecutar:

```bash
npm start
```

Luego abrir en el navegador:

- En la misma PC: http://localhost:3000
- Desde otra PC de la misma red: usar la IP que aparece en consola (por ejemplo, http://192.168.1.10:3000)

## Notas importantes
- La persistencia es en memoria RAM del backend.
- Si se reinicia el proceso del servidor, los datos se pierden.
- Mientras el servidor siga encendido, los datos de cada sesión se conservan entre recargas y entre cierres/aperturas del navegador.

## Ejemplo de uso rápido
1. Abrir la página.
2. Cargar nombre, edad y nota.
3. Presionar Guardar Alumno.
4. Cerrar y volver a abrir el navegador.
5. Volver a entrar a la misma URL: los datos cargados por esa sesión se mantienen.

## Solución de problemas

### 1) "node" no se reconoce como comando
Síntoma:
- Al ejecutar npm start aparece un error indicando que Node.js o npm no existe.

Qué hacer:
1. Instalar Node.js desde el sitio oficial.
2. Cerrar y volver a abrir la terminal.
3. Verificar con:

```bash
node -v
npm -v
```

### 2) El puerto 3000 está en uso
Síntoma:
- Error al iniciar el servidor (por ejemplo EADDRINUSE).

Qué hacer:
1. Cerrar el proceso que usa el puerto 3000.
2. O iniciar con otro puerto:

```bash
set PORT=3001 && npm start
```

Luego abrir http://localhost:3001

### 3) Desde otra PC no carga la página
Síntoma:
- En localhost funciona, pero otra computadora de la red no puede abrir la URL.

Qué revisar:
1. Que ambas PCs estén en la misma red.
2. Que estés usando la IP correcta mostrada por el servidor.
3. Que el firewall de Windows permita conexiones entrantes a Node.js en ese puerto.
4. Que no haya una VPN o red invitada aislando dispositivos.

### 4) Los datos desaparecen
Síntoma:
- Después de reiniciar el servidor, la lista vuelve vacía.

Explicación:
- Es el comportamiento esperado: los datos se guardan en memoria RAM.

Alternativa:
- Si necesitás persistencia real entre reinicios, hay que guardar en archivo (JSON) o base de datos.

### 5) Una persona ve datos de otra
Síntoma:
- Se mezclan listas de alumnos entre usuarios.

Qué revisar:
1. Que cada usuario use su propio navegador/dispositivo.
2. Que no estén compartiendo el mismo perfil de navegador o modo sincronizado.
3. Borrar cookies del sitio y volver a ingresar para generar una nueva sesión.
