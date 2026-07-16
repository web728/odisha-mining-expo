// lib/excelSheet.js
import { google } from "googleapis";

// Master column order for the shared "Submissions" sheet (image wale format ke hisaab se).
// Yaha naam/order badal sakte ho — append function sheet me jo bhi actual header
// row hogi usi ko follow karega, isliye tumhare purane data pe asar nahi padega.
const MASTER_HEADERS = [
    "Date & Time",
    "Platform",
    "Register As",
    "Company Name",
    "Contact Person",
    "Designation",
    "Email Id",
    "Mobile No."
];

// Credentials ab base64 string se aayenge (Hostinger pe raw JSON env var
// kabhi kabhi quote/newline escaping ki wajah se corrupt ho jaata hai,
// base64 me ye dikkat nahi aati).
function getCredentials() {

    const base64 = process.env.GOOGLE_CREDENTIALS_BASE64;

    if (!base64) {
        throw new Error("GOOGLE_CREDENTIALS_BASE64 environment variable is missing.");
    }

    const jsonString = Buffer.from(base64, "base64").toString("utf-8");

    return JSON.parse(jsonString);

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

// Sheet ki current header row laata hai. Agar khaali hai to MASTER_HEADERS likh deta hai.
// Jo bhi headers sheet me actually mile (chahe tumne baad me order/naam thoda idhar-udhar
// kar diya ho), wahi return karta hai — appendToExcel usi order me data bhejta hai.
async function ensureHeaderRow(googleSheets, spreadsheetId, sheetName) {

    const existing = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z1`,
    });

    const currentHeaders = existing.data.values && existing.data.values[0];

    if (currentHeaders && currentHeaders.length > 0) {
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

// rowData ek plain object hai, jaise:
// { "Company Name": "Spiro", "Contact Person": "Amit", ... }
// Sheet me jo bhi header order hai usi order me row bana ke append karta hai.
// Isliye agar tum kabhi sheet me column order badal do, code me kuch change
// nahi karna padega — bas key ka naam wahi rakhna jo yaha use ho raha hai.
export async function appendToExcel(spreadsheetId, sheetName, rowData) {
    try {

        const googleSheets = await getSheetsClient();

        const headers = await ensureHeaderRow(googleSheets, spreadsheetId, sheetName);

        const row = headers.map((header) => (rowData[header] !== undefined ? rowData[header] : "-"));

        await googleSheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:Z`,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: [row],
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