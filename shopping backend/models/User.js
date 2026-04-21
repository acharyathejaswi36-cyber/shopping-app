const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  mobile: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  otp: String,
  otpExpiry: Date,
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
});

module.exports = mongoose.model("User", userSchema);
