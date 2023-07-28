const Section = require("../models/section");
const Course = require("../models/Course");
const section = require("../models/section");

// create section

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    // create secction
    const newSection = await Section.create({ sectionName });
    // update course db
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // return success responce
    return res.status(200).json({
      success: true,
      message: "section created successfully ",
      updatedCourseDetails,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "section cration failed",
    });
  }
};

// update section handler
exports.updateSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, sectionId } = req.body;
    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "all  fields are required to updatw section",
      });
    }
    // update data

    const update = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // return responce
    return res.status(500).json({
      success: true,
      message: "section updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "section updation failed",
    });
  }
};

// delete section
exports.deleteSection = async (req, res) => {
  try {
    //  fetch data - we are sending data in params
    const { sectionId } = req.params;
    // validation
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "section id invalid",
      });
    }
    // delete section
    await section.findByIdAndDelete(sectionId);
    // return responce
    return res.status(500).json({
      success: true,
      message: "section deleted",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "section deletion failed",
    });
  }
};
