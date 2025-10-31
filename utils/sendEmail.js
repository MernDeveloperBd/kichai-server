// utils/sendEmail.js
const nodemailer = require("nodemailer");

async function sendVerificatonEmail(to, subject, body) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_APP_EMAIL,     // FIX: এখানে Gmail ইমেইল দিন
      pass: process.env.EMAIL_APP_PASS,      // App password (16 char)
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL_USER || "KI CHAI"} <${process.env.ADMIN_APP_EMAIL}>`, // FIX: display name + same email
    to,
    subject,
    html: body,
  };

  // Optional: কনফিগ ঠিক আছে কিনা আগে যাচাই
  await transporter.verify();

  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificatonEmail;