const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ Email transporter (WORKING CONFIG)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rathodkiran892@gmail.com",        // ✅ replace with your Gmail
    pass: "qfczxxpvowbqcfyz"           // ✅ replace with Gmail App Password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// ✅ Contact API
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: "rathodkiran892@gmail.com",      // ✅ SAME Gmail
      replyTo: email,
      to: "rathodkiran892@gmail.com",        // ✅ where you receive messages
      subject: `Portfolio Message from ${name}`,
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("EMAIL ERROR:", error);   // 👈 debug logs
    res.status(500).json({ success: false });
  }
});

// ✅ Correct PORT (Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
