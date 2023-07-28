const Profile = require("../models/profile");
const User = require("../models/user");

exports.updateProfile = async (req, res) => {
  try {
    // get data + userid
    const { gender, dob = "", about = "", contactnumber } = req.body;
    const id = req.user.id;
    // validation
    if (!gender || !contactnumber || !id) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    // findprofile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionaldetails;
    const profileDetails = Profile.findById(profileId);
    // update details
    profileDetails.dob = dob;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactnumber = contactnumber;
    await profileDetails.save();

    // return responce
    return res.status(200).json({
      success: true,
      message: "profile updated successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "profile updation failde",
      error: error.message,
    });
  }
};

// detete account handler
// hw - how can we schedule this deletion
exports.deleteAccount = async (req, res) => {
  try {
    // fetch id
    const id = req.user.id;
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionaldetails;
    // validation
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    // user ki additiondetails profilse se delete kar do
    await Profile.findByIdAndDelete({ _id: profileId });
    // user delete kar do
    await User.findByIdAndDelete({ _id: id });
    //  return responce
    return res.status(200).json({
      success: true,
      message: "user deleted",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "user deletion failde",
      error: error.message,
    });
  }
};

// get all user details handler
exports.getAlkUserDetails = async (req, res) => {
  try {
    // fetch id
    const id = req.user.id;
    // validation and get user details
    const userDetails = User.findById(id).populate("additionaldetails").exec();
    // return responce
    return res.status(400).json({
      success: true,
      message: "user details fetched",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "user details not fetched",
      error: error.message,
    });
  }
};
