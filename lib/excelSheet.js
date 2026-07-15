// lib/excelSheet.js
import { google } from "googleapis";

// Service account credentials ab file se nahi, env variable se aayenge.
// Serverless (Vercel etc.) pe deploy hone par JSON key file bundle nahi hoti,
// isliye file-read approach production me ENOENT error deta hai.
function getCredentials() {

    const raw = process.env.GOOGLE_CREDENTIALS_JSON;

    if (!raw) {
        throw new Error("GOOGLE_CREDENTIALS_JSON environment variable is missing.");
    }

    return JSON.parse(raw);

}

export async function appendToExcel(spreadsheetId, sheetName, rowData) {
    try {

        const credentials = getCredentials();

        const auth = new google.auth.GoogleAuth({
            credentials,
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