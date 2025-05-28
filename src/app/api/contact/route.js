import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const data = await req.json();

        // Setup Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Use environment variables for security
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ["info@nizona.co", "meet@genkiramune.com"], // Send to two emails
            subject: "New Contact Form Submission",
            text: `Salutation: ${data.salutation}\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}\nWebsite: ${data.website}\nMessage: ${data.message}`
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
    }
}
