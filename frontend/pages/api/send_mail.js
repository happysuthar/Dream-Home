import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("user",);
    
    let transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.MAILER_EMAIL, 
        pass: process.env.MAILER_PASSWORD, 
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text: message,
    });

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
