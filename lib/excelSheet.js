// lib/excelSheet.js
import { google } from "googleapis";

// Service account credentials env variable se aate hain (file se nahi —
// serverless deploy pe file bundle nahi hoti, isliye ENOENT aata tha).
function getCredentials() {

    const raw = process.env.GOOGLE_CREDENTIALS_JSON;

    if (!raw) {
        throw new Error("GOOGLE_CREDENTIALS_JSON environment variable is missing.");
    }

    return JSON.parse(raw);

}

async function getSheetsClient() {

    const credentials = getCredentials();

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();

    return google.sheets({ version: "v4", auth: client });

}

// Agar sheet tab ki pehli row khaali hai, to headers likh deta hai.
// Pehle se headers hain to kuch nahi karta (dobara overwrite nahi karega).
async function ensureHeaderRow(googleSheets, spreadsheetId, sheetName, headers) {

    const existing = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z1`,
    });

    const hasHeader = existing.data.values && existing.data.values.length > 0;

    if (!hasHeader) {

        await googleSheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: "RAW",
            resource: {
                values: [headers],
            },
        });

        console.log(`Header row added to Excel sheet: ${sheetName}`);

    }

}

export async function appendToExcel(spreadsheetId, sheetName, headers, rowData) {
    try {

        const googleSheets = await getSheetsClient();

        await ensureHeaderRow(googleSheets, spreadsheetId, sheetName, headers);

        await googleSheets.spreadsheets.values.append({
            spreadsheetId,
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