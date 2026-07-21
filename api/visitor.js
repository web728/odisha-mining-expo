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
            name,
            designation,
            company,
            email,
            phone,
            city,
            profile,
            interest
        } = req.body;

        if (!name || !company || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing."
            });
        }

        const interestList = Array.isArray(interest) ? interest : [];

        const client = await clientPromise;
        const db = client.db("futurex");

        await db.collection("visitors").insertOne({
            fullName: name,
            designation,
            company,
            email,
            phone,
            city,
            profile,
            interest: interestList,
            submittedAt: new Date()
        });

        const submittedAt = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });

        // --- Google Sheet me row add karo (shared "Website Enquries" tab) ---
        if (SPREADSHEET_ID) {
            await appendToExcel(SPREADSHEET_ID, SHEET_NAME, {
                "Date": submittedAt,                              // FIX: "Date & Time" -> "Date"
                "Platform": "Visitor Form",
                "Register As": "Visitor",
                "Company Name": company,
                "Contact Person": name,
                "Designation": designation || "-",
                "Email Id": email,
                "Mobile No.": phone,
                "Country": city || "-",                           // FIX: form ka "city" field yaha Country me jayega
                "Area of Interest": interestList.join(", ") || "-", // FIX: interest checkboxes comma se join hoke aayenge
                "Product Profile": profile || "-"                 // FIX: visitor profile yaha jayega
            });
        }

        await transporter.sendMail({

            from: `"Odisha Mining Expo" <${process.env.EMAIL_USER}>`,
            replyTo: email,

            to: [
                "info@futurextrade.com",
                "admin@futurextrade.com"
            ],

            subject: `Visitor Registration — ${name} | Odisha Mining Expo 2027`,

            html: buildAdminEmailHtml({
                badge: "Visitor Registration",
                submittedAt,
                rows: [
                    { label: "Full Name", value: name },
                    { label: "Designation", value: designation },
                    { label: "Company / Organisation", value: company },
                    { label: "Email", value: email },
                    { label: "Phone", value: phone },
                    { label: "City / Country", value: city },
                    { label: "Visitor Profile", value: profile },
                    { label: "Areas of Interest", value: interestList.join(", ") }
                ]
            })

        });

        return res.status(200).json({
            success: true,
            message: "Visitor registration submitted successfully."
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