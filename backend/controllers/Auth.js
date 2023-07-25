const User = require("../models/user");
const Otp = require("../models/otp");
const Profile = require("../models/profile");
const otpgenrator = require("otp-generator");
const bcrypt = require("bcrypt");
// const profile = require("../models/profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
try {
  exports.signUp = async (req, res) => {
    // data fetch from req ki body
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      accounttype,
      contactnumber,
      otp,
    } = req.body;
    // validate karo

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2 passwoed match karo bhai

    if (password != confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm password do not matching",
      });
    }

    // check user already exist or not

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    // fid most recent otp stored in otp db
    const recentotp = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentotp);
    // validate karo otp

    if (otp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp != recentotp.otp) {
      return res.status(400).json({
        success: false,
        message: "Otp do not matching",
      });
    }

    // hash password

    const hashedpassword = await bcrypt.hash(password, 10);

    // entry in db karo

    const profiledetails = await Profile.create({
      gender: null,
      dob: null,
      about: null,
      contactnumber: null,
    });

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedpassword,
      accounttype,
      additionaldetails: profiledetails._id,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstname}${lastname}`,
    });

    // return responce karo
    return res.status(200).json({
      success: true,
      message: "user registred",
      user,
    });
  };
} catch (err) {
  console.log(err);
  return res.status(500).json({
    success: false,
    message: "user registration failed",
  });
}

// login

exports.login = async (req, res) => {
  try {
    // grt data from req ki body
    const { email, password } = req.body;

    // data validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "all fields are required plese try again",
      });
    }

    // check user exists or not
    const user = User.findOne({ email }).populate("additionaldetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not registred, signup first",
      });
    }

    // match password and genrate jwt token
    if (await bcrypt.compare(password, user.password)) {
      // jwt token bana do bhai ab
      const payload = {
        email: user.email,
        id: user._id,
        accounttype: user.accounttype,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send responce

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).json({
        success: false,
        token,
        user,
        message: "Logged in",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "login failure try again plese",
    });
  }
};



// change password
exports.changepassword = async (req, res) => {
  try {
    // get data from req ki body
    const { email, password, newpassword, confirmnewpassword } = req.body;
    if (!email || !password || !newpassword || !confirmnewpassword) {
      return res.status(403).json({
        success: false,
        message: "all fields are required for password change",
      });
    }
    // get old password, newpassword, confirmnewpassword
    const user = User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "user do not exist",
      });
    }

    // validation
    if (newpassword != confirmnewpassword) {
      return res.status(403).json({
        success: false,
        message: "new pass and confirmpass do not matching",
      });
    }
    if (password != user.password) {
      return res.status(403).json({
        success: false,
        message: "old passwprd is not matching",
      });
    }
    // update password
    user.password = newpassword;
    return res.status(200).json({
      success: SVGComponentTransferFunctionElement,
      message: "password updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: "error while updating password",
    });
  }
};
