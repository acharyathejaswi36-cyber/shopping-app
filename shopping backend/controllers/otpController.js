const User = require("../models/User");
const transporter = require("../config/mailer");
const generateOtp = require("../utils/generateOtp");
const crypto = require("crypto");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp.toString()).digest("hex");

const MAX_OTP_ATTEMPTS = 5;

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({ message: "If that email exists, an OTP has been sent" });
    }

    if (user.otpExpiry && user.otpExpiry > Date.now()) {
      return res.status(429).json({
        message: "An OTP was already sent. Please wait before requesting another",
      });
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    await User.updateOne(
      { email },
      { otp: hashedOtp, otpExpiry, otpAttempts: 0 }
    );

    await transporter.sendMail({
      from: `"Shopping App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes. Do not share this with anyone.</p>`,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("SENT OTP:", otp);
    }

    res.json({ message: "If that email exists, an OTP has been sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      await User.updateOne(
        { email },
        { otp: null, otpExpiry: null, otpAttempts: 0 }
      );
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      await User.updateOne(
        { email },
        { otp: null, otpExpiry: null, otpAttempts: 0 }
      );
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new OTP",
      });
    }

    const hashedInput = hashOtp(otp.toString().trim());
    if (user.otp !== hashedInput) {
      await User.updateOne({ email }, { $inc: { otpAttempts: 1 } });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.updateOne(
      { email },
      { isVerified: true, otp: null, otpExpiry: null, otpAttempts: 0 }
    );

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};