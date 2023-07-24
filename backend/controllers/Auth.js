const User = require("../models/user");
const Otp = require("../models/otp");
const otpgenrator = require("otp-generator");

// send otp
exports.sendOtp = async (req, res) => {
  try {
    // email fetch kar lo phle bhai
    const { email } = req.body;

    // check if user already exist(signedup) or not
    const checkuserpresent = User.findOne({ email });

    if (checkuserpresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // otp genrate karlo bhai ab
    var otp = otpgenrator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("Otp genrated successfully", otp);

    // otp ki uniqueness check karo bhai
    let result = await Otp.findOne({ otp: otp });

    // jab tak old otp match karta rahe tab tak new otp genrate karte raho bhai

    // while loop khatam hot hot nw otp mil jasga bhai
    while (result) {
      otp = otpgenrator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      result = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // db me entry kar do bhai
    const otpBody = Otp.create(otpPayload);
    console.log(otpBody);

    // return rsponce
    res.status(200).json({
      success: true,
      message: "Otp sent",
    });
  } catch (errr) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
  
};
 


// signup

// login

// change password
