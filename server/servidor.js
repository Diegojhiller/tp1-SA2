import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del archivo actual (equivalente a __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const puerto = 3000;

const servidor = http.createServer((req, res) => {

  const rutaArchivo = path.join(__dirname, "public", "index.html");

  fs.readFile(rutaArchivo, (error, contenido) => {

    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      res.end("Error interno del servidor");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end(contenido);
  });

});

servidor.listen(puerto, () => {
  console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});