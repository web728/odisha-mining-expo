// lib/excelSheet.js
import { google } from "googleapis";

// Master column order for the shared "Website Enquries" sheet.
// NOTE: Ye tumhari sheet ke ACTUAL header text se exactly match hone chahiye
// (jaise "Date" na ki "Date & Time" — apni sheet ke row 1 ko dekh ke confirm kar lena).
const MASTER_HEADERS = [
    "Date",
    "Platform",
    "Register As",
    "Company Name",
    "Contact Person",
    "Designation",
    "Email Id",
    "Mobile No."
];

function getCredentials() {
    const base64 = process.env.GOOGLE_CREDENTIALS_BASE64;
    if (!base64) {
        throw new Error("GOOGLE_CREDENTIALS_BASE64 environment variable is missing.");
    }
    const jsonString = Buffer.from(base64, "base64").toString("utf-8");
    const creds = JSON.parse(jsonString);
    console.log("Using service account:", creds.client_email); // TEMP DEBUG
    return creds;
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

// Sheet ki current header row laata hai (row 1). Agar khaali hai to MASTER_HEADERS likh deta hai.
async function ensureHeaderRow(googleSheets, spreadsheetId, sheetName) {

    const existing = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z1`,
    });

    const currentHeaders = existing.data.values && existing.data.values[0];

    if (currentHeaders && currentHeaders.length > 0) {
        // Trailing empty header cells ko trim karo taaki header count sahi rahe
        while (currentHeaders.length && !currentHeaders[currentHeaders.length - 1]) {
            currentHeaders.pop();
        }
        return currentHeaders;
    }

    await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        resource: {
            values: [MASTER_HEADERS],
        },
    });

    console.log(`Header row added to Excel sheet: ${sheetName}`);

    return MASTER_HEADERS;
}

// FIX: pehle "append" API use ho raha tha, jo apna "table" khud detect karta hai —
// aur sheet mein manually-edited STATUS columns (Q/R/S) ki wajah se wo galat table
// pakad leta tha, isliye naya data beech ke column (Area of Interest) se shuru
// hokar likha ja raha tha, na ki column A se.
//
// Ab hum khud column A check karke agla khaali row number nikalte hain, aur
// "update" se EXACT us row/column pe likhte hain — isse koi guessing nahi hoti,
// data hamesha column A se hi shuru hoga.
async function getNextEmptyRow(googleSheets, spreadsheetId, sheetName) {
    const existing = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:A`,
    });

    const values = existing.data.values || [];

    // values.length hi agla khaali row hai (1-indexed), kyunki row 1 header hai
    // aur agar A column mein kahin gap bhi ho to bhi hum sirf last filled row ke
    // just niche likhenge (append hamesha end mein hona chahiye).
    return values.length + 1;
}

// rowData ek plain object hai, jaise:
// { "Company Name": "Spiro", "Contact Person": "Amit", ... }
// Sheet me jo bhi header order hai usi order me row bana ke SPECIFIC row/column pe likhta hai.
export async function appendToExcel(spreadsheetId, sheetName, rowData) {
    try {

        const googleSheets = await getSheetsClient();

        const headers = await ensureHeaderRow(googleSheets, spreadsheetId, sheetName);

        const row = headers.map((header) => {
            const key = header && header.trim();
            return rowData[key] !== undefined ? rowData[key] : "-";
        });

        const nextRow = await getNextEmptyRow(googleSheets, spreadsheetId, sheetName);

        // Column A se lekar headers.length tak ka exact range banate hain,
        // jaise agar 19 headers hain to A177:S177 (append nahi, update — koi ambiguity nahi)
        const lastColLetter = columnLetter(headers.length);
        const range = `${sheetName}!A${nextRow}:${lastColLetter}${nextRow}`;

        await googleSheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [row],
            },
        });

        console.log(`Data successfully saved to Excel sheet: ${sheetName}, row ${nextRow}`);

    }

    catch (error) {

        // Excel me save na ho paaye to bhi Mongo save aur mail bhejna nahi rukna chahiye,
        // isliye yahan sirf log karke chhod rahe hain, error throw nahi kar rahe.
        console.error("Error saving data to Google Sheets:", error);

    }
}

// Column number (1-indexed) ko letter mein convert karta hai, jaise 1 -> A, 19 -> S, 27 -> AA
function columnLetter(colNum) {
    let letter = "";
    while (colNum > 0) {
        const rem = (colNum - 1) % 26;
        letter = String.fromCharCode(65 + rem) + letter;
        colNum = Math.floor((colNum - 1) / 26);
    }
    return letter;
}