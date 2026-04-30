

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// 🔐 Configure your email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kiran.rathod@nmiet.edu.in",
    pass: "rrpyrhagvbcutqng"
  }
});

// 🚀 Contact API
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from:"kiran.rathod@nmiet.edu.in",
      replyTo: email, 
      to: "kiran.rathod@nmiet.edu.in",
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
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));