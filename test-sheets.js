const path = require("path");
const { google } = require("googleapis");

async function main() {
  const KEYFILE = path.join(__dirname, "secrets", "google-service-account.json");
  const SPREADSHEET_ID = "1AVL0xdYRou9fnoVO_AdE0jwPOsEBWoBP3u8J33y1egE";

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Fila de prueba (simula escaneo a Caja)
  const newRow = [
    "TEST-COD-001",
    "Producto demo",
    "150",
    "Producto agregado desde script de prueba",
    "1",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Cajas!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [newRow],
    },
  });

  console.log("Fila agregada correctamente en Cajas");
}

main().catch((err) => {
  console.error("Error escribiendo en Google Sheet:");
  console.error(err?.message || err);
});
