// lib/excelSheet.js
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

// ESM me __dirname nahi milta, isliye manually banaya
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON key file ka sahi path (project root me api/google-credentials.json)
const KEYS_PATH = path.join(__dirname, "../api/google-credentials.json");

export async function appendToExcel(spreadsheetId, sheetName, rowData) {
    try {

        const auth = new google.auth.GoogleAuth({
            keyFile: KEYS_PATH,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!A:Z`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [rowData],
            },
        });

        console.log(`Data successfully saved to Excel sheet: ${sheetName}`);

    }

    catch (error) {

        // Excel me save na ho paaye to bhi Mongo save aur mail bhejna nahi rukna chahiye,
        // isliye yahan sirf log karke chhod rahe hain, error throw nahi kar rahe.
        console.error("Error saving data to Google Sheets:", error);

    }
}