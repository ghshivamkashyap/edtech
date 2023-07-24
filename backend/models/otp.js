const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 2 * 60,
  },
});

// function to sn email

async function sendverificationmail(email, otp) {
  try {
    const mailResponce = await mailsender(email, "verification mail", otp);
    console.log("Email sent successfully", mailResponce);
  } catch (err) {
    console.log(`error in sending verification mail=> ${err}`);
    throw err;
  }
}

OtpSchema.pre("save", async function (next) {
  await sendverificationmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("Otp", OtpSchema);
