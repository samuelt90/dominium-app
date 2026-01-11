const http = require("http");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// Railway asigna PORT automáticamente
const PORT = process.env.PORT || 5173;

// Sheet ID (puedes dejarlo fijo o moverlo a env)
const SPREADSHEET_ID =
  process.env.SPREADSHEET_ID || "1AVL0xdYRou9fnoVO_AdE0jwPOsEBWoBP3u8J33y1egE";

// IMPORTANTE: ahora viene desde variable de entorno (NO archivo)
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

async function getSheetsClient() {
  if (!SERVICE_ACCOUNT_JSON) {
    throw new Error(
      "Falta GOOGLE_SERVICE_ACCOUNT_JSON en variables de entorno (Railway)."
    );
  }

  let credentials;
  try {
    credentials = JSON.parse(SERVICE_ACCOUNT_JSON);
  } catch (e) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON no es JSON válido. Pégalo completo con llaves { }."
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

async function findProductByCode(sheets, codigo) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Productos!A:D",
  });

  const values = res.data.values || [];
  if (values.length === 0) return null;

  // Asume encabezado en fila 1
  for (let i = 1; i < values.length; i++) {
    const row = values[i] || [];
    const code = String(row[0] || "").trim();
    if (code === codigo) {
      return {
        codigo: code,
        nombre: row[1] || "",
        precio_sugerido_venta: row[2] || "",
        detalle: row[3] || "",
      };
    }
  }
  return null;
}

async function appendToCaja(sheets, product) {
  const newRow = [
    product.codigo,
    product.nombre,
    product.precio_sugerido_venta,
    product.detalle,
    "1",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Cajas!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newRow] },
  });
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function serveFile(res, filePath, contentType) {
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  // API: registrar producto
  if (req.method === "POST" && req.url === "/api/add-product") {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", async () => {
      try {
        const body = raw ? JSON.parse(raw) : {};
        const codigo = String(body.codigo || "").trim();
        const nombre = String(body.nombre || "").trim();
        const precio = String(body.precio_sugerido_venta || "").trim();
        const detalle = String(body.detalle || "").trim();

        if (!codigo) return sendJson(res, 400, { ok: false, error: "codigo requerido" });
        if (!nombre) return sendJson(res, 400, { ok: false, error: "nombre requerido" });
        if (!precio) return sendJson(res, 400, { ok: false, error: "precio_sugerido_venta requerido" });

        const sheets = await getSheetsClient();

        // Evitar duplicados por código
        const existing = await findProductByCode(sheets, codigo);
        if (existing) {
          return sendJson(res, 200, { ok: true, already_exists: true, product: existing });
        }

        const newRow = [codigo, nombre, precio, detalle];
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: "Productos!A:D",
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [newRow] },
        });

        return sendJson(res, 200, { ok: true });
      } catch (e) {
        return sendJson(res, 500, { ok: false, error: e?.message || "error" });
      }
    });
    return;
  }

  // API: agregar a caja
  if (req.method === "POST" && req.url === "/api/add-to-caja") {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", async () => {
      try {
        const body = raw ? JSON.parse(raw) : {};
        const codigo = String(body.codigo || "").trim();
        if (!codigo) return sendJson(res, 400, { ok: false, error: "codigo requerido" });

        const sheets = await getSheetsClient();
        const product = await findProductByCode(sheets, codigo);
        if (!product) return sendJson(res, 404, { ok: false, error: "Producto no existe en Productos" });

        await appendToCaja(sheets, product);
        return sendJson(res, 200, { ok: true, product });
      } catch (e) {
        return sendJson(res, 500, { ok: false, error: e?.message || "error" });
      }
    });
    return;
  }

  // Servir index.html
  if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/index.html"))) {
    return serveFile(res, path.join(__dirname, "index.html"), "text/html; charset=utf-8");
  }

  // favicon
  if (req.method === "GET" && req.url === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Dominium demo corriendo en http://127.0.0.1:${PORT}`);
});
