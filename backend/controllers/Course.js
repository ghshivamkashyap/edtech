const Course = require("../models/Course");
const Tag = require("../models/categorys");
const User = require("../models/user");
const { uploadImage } = require("../utils/imageUploader");
require("dotenv").config();

// createcours handler function
exports.createCource = async (req, res) => {
  try {
    // fth ata
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      status,
      tag,
      category,
      instructions,
    } = req.body;

    // gt thumbnail
    const thumbnail = req.file.thumbnailImg;

    // valiation

    if (
      !thumbnail ||
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields ar required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, {
      accounttype: "Instructor",
    });
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "instructor details not found",
      });
    }

    // tag validation

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "categoryDetails details not found",
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
      tag: tag,
      category: categoryDetails._id,
      picture: thumbnailImg.secure_url,
      status: status,
      instructions: instructions,
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

    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    // return responce
    return res.status(200).json({
      success: true,
      message: "cource created successfully",
      data: newCourse,
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

exports.showAllCource = async (req, res) => {
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

// get cource details handler function
exports.getCourseDetails = async (req, res) => {
  try {
    // get course id
    const { courseId } = req.body;
    // get course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionaldetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "can not get course with details",
      });
    }
    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      data: courseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};
