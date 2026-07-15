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

        await transporter.sendMail({

            from: `"Futurex Website" <${process.env.EMAIL_USER}>`,

            to: [
                "info@futurextrade.com",
                "admin@futurextrade.com"
            ],

            subject: "New Exhibitor Registration",

            html: `

            <h2>New Exhibitor Registration</h2>

            <table border="1" cellpadding="10" cellspacing="0">

                <tr>
                    <td><b>Company</b></td>
                    <td>${company}</td>
                </tr>

                <tr>
                    <td><b>Contact Person</b></td>
                    <td>${name}</td>
                </tr>

                <tr>
                    <td><b>Designation</b></td>
                    <td>${designation || "-"}</td>
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
                    <td><b>Country</b></td>
                    <td>${country || "-"}</td>
                </tr>

                <tr>
                    <td><b>Primary Category</b></td>
                    <td>${category || "-"}</td>
                </tr>

                <tr>
                    <td><b>Stand Preference</b></td>
                    <td>${standSize || "-"}</td>
                </tr>

                <tr>
                    <td><b>Requirements</b></td>
                    <td>${message || "-"}</td>
                </tr>

            </table>

            <br>

            <b>Submitted At:</b> ${new Date().toLocaleString("en-IN")}

            `

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