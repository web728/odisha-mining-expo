import clientPromise from "../lib/mongodb.js";
import { transporter } from "../lib/mailer.js";

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

        if (!fullName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing."
            });
        }

        const client = await clientPromise;

        const db = client.db("futurex");

        await db.collection("contacts").insertOne({

            fullName,
            company,
            email,
            phone,
            designation,
            country,
            interestType,
            message,

            submittedAt: new Date()

        });

        await transporter.sendMail({

            from: `"Futurex Website" <${process.env.EMAIL_USER}>`,

            to: [
                "info@futurextrade.com",
                "admin@futurextrade.com"
            ],

            subject: "New Contact Form Submission",

            html: `

            <h2>New Contact Enquiry</h2>

            <table border="1" cellpadding="10" cellspacing="0">

            <tr>
                <td><b>Full Name</b></td>
                <td>${fullName}</td>
            </tr>

            <tr>
                <td><b>Company</b></td>
                <td>${company || "-"}</td>
            </tr>

            <tr>
                <td><b>Email</b></td>
                <td>${email}</td>
            </tr>

            <tr>
                <td><b>Phone</b></td>
                <td>${phone}</td>
            </tr>

            <tr>
                <td><b>Designation</b></td>
                <td>${designation || "-"}</td>
            </tr>

            <tr>
                <td><b>Country</b></td>
                <td>${country || "-"}</td>
            </tr>

            <tr>
                <td><b>Interest</b></td>
                <td>${interestType || "-"}</td>
            </tr>

            <tr>
                <td><b>Message</b></td>
                <td>${message || "-"}</td>
            </tr>

            </table>

            <br>

            <b>Submitted At:</b> ${new Date().toLocaleString("en-IN")}

            `

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