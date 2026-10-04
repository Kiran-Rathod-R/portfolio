require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { saveMessage, getMessages } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Server is running with MySQL integration 🚀");
});

// 🔐 Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "kiran.rathod@nmiet.edu.in",
    pass: process.env.EMAIL_PASS || "rrpyrhagvbcutqng"
  }
});

// 🚀 Contact & Email Receive API (Saves to MySQL & Sends Email)
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields: name, email, or message." });
  }

  let dbSaved = false;
  let dbError = null;

  // 1. Save mail/message to MySQL Database
  try {
    await saveMessage(name, email, message);
    dbSaved = true;
    console.log(`📥 Saved email from ${email} to MySQL database.`);
  } catch (err) {
    console.error("❌ MySQL Save Error:", err.message);
    dbError = err.message;
  }

  // 2. Send email via Nodemailer
  let emailSent = false;
  let emailError = null;

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER || "kiran.rathod@nmiet.edu.in"}>`,
      replyTo: email,
      to: process.env.EMAIL_USER || "kiran.rathod@nmiet.edu.in",
      subject: `Portfolio Message from ${name}`,
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Saved to MySQL Database:</strong> ${dbSaved ? "YES ✅" : "NO ❌ (" + dbError + ")"}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f4f4f4; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
      `
    });
    emailSent = true;
  } catch (err) {
    console.error("❌ Nodemailer Error:", err.message);
    emailError = err.message;
  }

  // Determine overall status
  if (dbSaved || emailSent) {
    return res.status(200).json({
      success: true,
      message: "Message processed successfully!",
      dbSaved,
      emailSent,
      dbError,
      emailError
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Failed to save to database and failed to send email.",
      dbError,
      emailError
    });
  }
});

// 📊 API to retrieve all saved mails/messages from MySQL database
app.get("/messages", async (req, res) => {
  try {
    const messages = await getMessages();
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));