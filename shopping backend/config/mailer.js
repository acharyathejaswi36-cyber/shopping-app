const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",   
  port: 587,                
  secure: false,           
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Email config error:", error);
  } else {
    console.log("Email server ready");
  }
});

module.exports = transporter;
