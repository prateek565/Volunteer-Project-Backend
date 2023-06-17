const mongoose = require('mongoose');

// Define the OTP schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // OTP expires after 5 minutes (300 seconds)
});

// Create the OTP model
const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;