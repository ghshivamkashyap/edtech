const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookie.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    //   if toke in missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // varify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "error in auth token validation",
    });
  }
};

// isstudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accounttype !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Protectde route for student",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user role cn note be varified plese try again",
    });
  }
};

// isinstrutor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accounttype !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Protectde route for Instructor",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user role cn note be varified plese try again",
    });
  }
};

// isamin

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accounttype !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Protectde route for Admin",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "user role cn note be varified plese try again",
    });
  }
};
