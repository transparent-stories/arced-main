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
            to: ["info@nizona.co", "meet@genkiramune.com"],
            subject: "New Distributor Inquiry",
            text: `
                Name of Company: ${data.companyName}
                Website: ${data.website || "N/A"}
                Contact Person: ${data.contactName}
                Email: ${data.email}
                Designation: ${data.designation}
                Role: ${data.role}
                Territory: ${data.territory}
                Shipping Address: ${data.shippingAddress}
                LinkedIn: ${data.linkedin || "N/A"}
                Distribution Plans: ${data.distributionPlans}
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
    }
}
