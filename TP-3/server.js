import http from "http";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const STATIC_DIR = __dirname;

// Almacen en memoria del backend: una lista de alumnos por navegador/sesion.
const alumnosPorSesion = new Map();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function enviarJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function parsearCookies(cookieHeader = "") {
  const cookies = {};

  cookieHeader.split(";").forEach((parte) => {
    const [clave, ...resto] = parte.trim().split("=");
    if (!clave) {
      return;
    }

    cookies[clave] = decodeURIComponent(resto.join("="));
  });

  return cookies;
}

function obtenerSesion(req, res) {
  const cookies = parsearCookies(req.headers.cookie);
  let sid = cookies.sid;

  if (!sid) {
    sid = randomUUID();
    res.setHeader(
      "Set-Cookie",
      `sid=${encodeURIComponent(sid)}; Max-Age=31536000; Path=/; SameSite=Lax`
    );
  }

  if (!alumnosPorSesion.has(sid)) {
    alumnosPorSesion.set(sid, []);
  }

  return sid;
}

function leerBodyJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        reject(new Error("El body es demasiado grande."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON invalido."));
      }
    });

    req.on("error", reject);
  });
}

function validarAlumno(alumno) {
  if (!alumno || typeof alumno !== "object") {
    return "Faltan datos del alumno.";
  }

  const nombre = String(alumno.nombre ?? "").trim();
  const edad = Number(alumno.edad);
  const nota = Number(alumno.nota);

  if (!nombre) {
    return "El nombre es obligatorio.";
  }

  if (!Number.isInteger(edad) || edad < 0) {
    return "La edad debe ser un entero mayor o igual a 0.";
  }

  if (!Number.isFinite(nota)) {
    return "La nota debe ser numerica.";
  }

  return null;
}

function manejarApi(req, res, sid) {
  const lista = alumnosPorSesion.get(sid) || [];

  if (req.method === "GET") {
    enviarJson(res, 200, { alumnos: lista });
    return;
  }

  if (req.method === "POST") {
    leerBodyJson(req)
      .then((body) => {
        const error = validarAlumno(body);
        if (error) {
          enviarJson(res, 400, { error });
          return;
        }

        const nuevoAlumno = {
          nombre: String(body.nombre).trim(),
          edad: Number(body.edad),
          nota: Number(body.nota)
        };

        lista.push(nuevoAlumno);
        alumnosPorSesion.set(sid, lista);

        enviarJson(res, 201, { alumnos: lista });
      })
      .catch((error) => {
        enviarJson(res, 400, { error: error.message });
      });

    return;
  }

  if (req.method === "DELETE") {
    alumnosPorSesion.set(sid, []);
    enviarJson(res, 200, { alumnos: [] });
    return;
  }

  enviarJson(res, 405, { error: "Metodo no permitido." });
}

function servirEstatico(req, res) {
  let urlPath = req.url || "/";

  if (urlPath === "/") {
    urlPath = "/index.html";
  }

  const rutaNormalizada = path.normalize(path.join(STATIC_DIR, urlPath));

  if (!rutaNormalizada.startsWith(STATIC_DIR)) {
    enviarJson(res, 403, { error: "Acceso denegado." });
    return;
  }

  fs.readFile(rutaNormalizada, (error, contenido) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Archivo no encontrado.");
        return;
      }

      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error interno del servidor.");
      return;
    }

    const extension = path.extname(rutaNormalizada).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(contenido);
  });
}

const servidor = http.createServer((req, res) => {
  const sid = obtenerSesion(req, res);

  if ((req.url || "").startsWith("/api/alumnos")) {
    manejarApi(req, res, sid);
    return;
  }

  servirEstatico(req, res);
});

servidor.listen(PORT, HOST, () => {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const nombre of Object.keys(interfaces)) {
    for (const data of interfaces[nombre] || []) {
      if (data.family === "IPv4" && !data.internal) {
        ips.push(data.address);
      }
    }
  }

  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  if (ips.length > 0) {
    console.log("Acceso desde otras PCs en la red:");
    ips.forEach((ip) => console.log(`- http://${ip}:${PORT}`));
  }
}
);