const Course = require("../models/Course");
const Tag = require("../models/categorys");
const User = require("../models/user");
const { uploadImage } = require("../utils/imageUploader");
require("dotenv").config();

// createcours handler function
exports.createCource = async (req, res) => {
  try {
    // fth ata
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // gt thumbnail
    const thumbnail = req.file.thumbnailImg;

    // valiation

    if (
      !thumbnail ||
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields ar required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "instructor details not found",
      });
    }

    // tag validation

    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "tag details not found",
      });
    }

    // upload images to cloudinary
    const thumbnailImg = await uploadImage(thumbnail, process.env.FOLDER_NAME);

    // create entry for new cource

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      picture: thumbnailImg.secure_url,
    });

    // user ko update karna hai instructor ki list me dal do is cource ko
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update tag ka schema

    // return responce
    return res.status(200).json({
      success: true,
      message: "cource created successfully",
      ata: newCourse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "failed to create cource",
    });
  }
};

// get all cources handler functoon

exports.showAllours = async (rq, res) => {
  try {
    const allCources = await Course.find({}).populate("instructor").exec();

    return res.status(200).json({
      success: true,
      message: "data from cources fetched successfuly",
      data: allCources,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "can not fetch course data",
      error: err.message,
    });
  }
};
