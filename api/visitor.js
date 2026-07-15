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

        await transporter.sendMail({

            from: `"Futurex Website" <${process.env.EMAIL_USER}>`,

            to: [
                "info@futurextrade.com",
                "admin@futurextrade.com"
            ],

            subject: "New Visitor Registration",

            html: `

            <h2>New Visitor Registration</h2>

            <table border="1" cellpadding="10" cellspacing="0">

                <tr>
                    <td><b>Full Name</b></td>
                    <td>${name}</td>
                </tr>

                <tr>
                    <td><b>Designation</b></td>
                    <td>${designation || "-"}</td>
                </tr>

                <tr>
                    <td><b>Company / Organisation</b></td>
                    <td>${company}</td>
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
                    <td><b>City / Country</b></td>
                    <td>${city || "-"}</td>
                </tr>

                <tr>
                    <td><b>Visitor Profile</b></td>
                    <td>${profile || "-"}</td>
                </tr>

                <tr>
                    <td><b>Areas of Interest</b></td>
                    <td>${interestList.length ? interestList.join(", ") : "-"}</td>
                </tr>

            </table>

            <br>

            <b>Submitted At:</b> ${new Date().toLocaleString("en-IN")}

            `

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