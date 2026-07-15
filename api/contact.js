import clientPromise from "../lib/mongodb.js";
import { transporter } from "../lib/mailer.js";
import { buildAdminEmailHtml } from "../lib/emailTemplate.js";

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
            company,
            email,
            phone,
            designation,
            country,
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
            // company,
            email,
            phone,
            // designation,
            // country,
            interestType,
            message,

            submittedAt: new Date()

        });

        const submittedAt = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });

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
                    // { label: "Company", value: company },
                    { label: "Email", value: email },
                    { label: "Phone", value: phone },
                    // { label: "Designation", value: designation },
                    // { label: "Country", value: country },
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