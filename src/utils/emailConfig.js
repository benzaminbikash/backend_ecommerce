const nodemailer = require("nodemailer");

const emailConfig = async (email, subject, text) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    html: text,
  });
};
module.exports = { emailConfig };
