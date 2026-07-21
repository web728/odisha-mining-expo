import clientPromise from "../lib/mongodb.js";
import { transporter } from "../lib/mailer.js";
import { buildAdminEmailHtml } from "../lib/emailTemplate.js";
import { appendToExcel } from "../lib/excelSheet.js";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Website Enquries";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const {
            company,
            name,
            designation,
            email,
            phone,
            country,
            category,
            standSize,
            message
        } = req.body;

        if (!company || !name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing."
            });
        }

        const client = await clientPromise;
        const db = client.db("futurex");

        await db.collection("exhibitors").insertOne({
            company,
            fullName: name,
            designation,
            email,
            phone,
            country,
            category,
            standSize,
            message,
            submittedAt: new Date()
        });

        const submittedAt = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });

        // --- Google Sheet me row add karo (shared "Website Enquries" tab) ---
        if (SPREADSHEET_ID) {
            await appendToExcel(SPREADSHEET_ID, SHEET_NAME, {
                "Date": submittedAt,                         // FIX: "Date & Time" -> "Date"
                "Platform": "Exhibitor Form",
                "Register As": "Exhibitor",
                "Company Name": company,
                "Contact Person": name,
                "Designation": designation || "-",
                "Email Id": email,
                "Mobile No.": phone,
                "Country": country || "-",                   // FIX: ab Country column bhi fill hoga
                "Area of Interest": category || "-",         // FIX: exhibitor ki category yaha jayegi
                "Message": `Stand: ${standSize || "-"} | ${message || "-"}`  // FIX: stand size + message combine
            });
        }

        await transporter.sendMail({

            from: `"Odisha Mining Expo" <${process.env.EMAIL_USER}>`,
            replyTo: email,

            to: [
                "info@futurextrade.com",
                "admin@futurextrade.com"
            ],

            subject: `Exhibitor Registration — ${company} | Odisha Mining Expo 2027`,

            html: buildAdminEmailHtml({
                badge: "Exhibitor Registration",
                submittedAt,
                rows: [
                    { label: "Company", value: company },
                    { label: "Contact Person", value: name },
                    { label: "Designation", value: designation },
                    { label: "Email", value: email },
                    { label: "Phone", value: phone },
                    { label: "Country", value: country },
                    { label: "Primary Category", value: category },
                    { label: "Stand Preference", value: standSize },
                    { label: "Requirements", value: message }
                ]
            })

        });

        return res.status(200).json({
            success: true,
            message: "Exhibitor registration submitted successfully."
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}