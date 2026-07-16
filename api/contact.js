import clientPromise from "../lib/mongodb.js";
import { transporter } from "../lib/mailer.js";
import { buildAdminEmailHtml } from "../lib/emailTemplate.js";
import { appendToExcel } from "../lib/excelSheet.js";

// Google Sheet ID (browser URL me sheet kholne pe /d/ aur /edit ke beech wala part)
// .env me GOOGLE_SHEET_ID set karna — code me hardcode mat karo
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Teeno forms (Contact / Exhibitor / Visitor) ab isi ek tab me jaate hain.
const SHEET_NAME = "Submissions";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const {
            fullName,
            email,
            phone,
            interestType,
            message
        } = req.body;

        if (!fullName || !email || !phone || !interestType || !message) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing."
            });
        }

        const client = await clientPromise;

        const db = client.db("futurex");

        await db.collection("contacts").insertOne({

            fullName,
            email,
            phone,
            interestType,
            message,

            submittedAt: new Date()

        });

        const submittedAt = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });

        // --- Google Sheet me row add karo (shared "Submissions" tab) ---
        if (SPREADSHEET_ID) {
            await appendToExcel(SPREADSHEET_ID, SHEET_NAME, {
                "Date & Time": submittedAt,
                "Platform": "Contact Form",
                "Register As": interestType,
                "Company Name": "-",
                "Contact Person": fullName,
                "Designation": "-",
                "Email Id": email,
                "Mobile No.": phone
            });
        }

        await transporter.sendMail({

            from: `"Odisha Mining Expo" <${process.env.EMAIL_USER}>`,
            replyTo: email,

            to: [
                "info@futurextrade.com",
                "admin@futurextrade.com"
            ],

            subject: `New Contact Enquiry — ${fullName} | Odisha Mining Expo 2027`,

            html: buildAdminEmailHtml({
                badge: "New Contact Enquiry",
                submittedAt,
                rows: [
                    { label: "Full Name", value: fullName },
                    { label: "Email", value: email },
                    { label: "Phone", value: phone },
                    { label: "Interest", value: interestType },
                    { label: "Message", value: message }
                ]
            })

        });

        return res.status(200).json({

            success: true,

            message: "Form submitted successfully."

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