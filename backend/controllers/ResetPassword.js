const User = require("../models/user");
const mailsender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetpassword token
exports.resetPasswordToken = async (req, res) => {
  try {
    //  get email from req body
    const email = req.body;
    // validate email
    const vlidatemail = User.findOne({ email });
    if (!vlidatemail) {
      return res.status(403).json({
        success: false,
        message: "this email is not registred",
      });
    }
    // genrate token
    const token = crypto.randomUUID();
    // update to user db by ading expiration time and token
    const updatedetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );
    // create URLsend mail having url
    const url = `http://localhost:3000/update-password/${token}`;

    //   send mail contaning reset password link
    await mailsender(email, "Password reset link", url);

    // return responce
    return res.json({
      success: true,
      message: "password updation mail sent",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong whilse sending reset pass mail",
    });
  }
};

// reset password
try {
  exports.resetPassword = async (req, res) => {
    // fetch data
    const { password, confirmpassword, token } = req.body;
    // validation
    if (password != confirmpassword) {
      return res.json({
        success: false,
        message: "password and confirm pass donot match",
      });
    }
    // get userdetails from db using token
    const userdetails = await User.findOne({ token: token });
    if (!userdetails) {
      return res.json({
        success: false,
        message: "token invalid ",
      });
    }
    // token time check
    if (userdetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "token expired ",
      });
    }
    //  hash password
    const hashedpassword = await bcrypt.hash(password, 10);
    // passupdate in db
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedpassword },
      { new: true }
    );

    // return responce
    return res.status(500).json({
      success: true,
      message: "password reset successfully",
    });
  };
} catch (err) {
  console.log(err);
  return res.status(400).json({
    success: false,
    message: "password reset failed",
  });
}
