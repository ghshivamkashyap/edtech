const Subsection = require("../models/subSection");
const Section = require("../models/section");
const { uploadImage } = require("../utils/imageUploader");
require("dotenv").config();

// create subsection

exports.createSubsection = async (req, res) => {
  try {
    // fetch data
    const { sectionId, title, timeDuration, description } = req.body;
    // fetch video file
    const video = req.files.videoFile;
    // validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "all fields ar required",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImage(video, process.env.FOLDER_NAME);
    // create subsection
    const subSectionDetails = await Subsection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // inseert subsection id in section db
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    );
    // hw - use populate t show data in section instead of subsection id
    // return responce
    return res.status(200).json({
      success: true,
      message: "subsection creted successfully",
      updatedSection,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "subsection creation failed",
    });
  }
};

// update subsection

exports.createSubsection = async (req, res) => {
  try {
    // fettch data
    const { subSectionId, title, timeDuration, description } = req.body;
    // fetch video file
    const video = req.files.videoFile;
    // validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subsection id not present",
      });
    }

    // agar video change hai to upload kar do bhai  varna skip kar do
    if (video) {
      const updatedUploadDetails = await uploadImage(
        video,
        process.env.FOLDER_NAME
      );
    }

    // data update kar do
    const updatedSubSectionDetails = await Subsection.findByIdAndUpdate(
      subSectionId,
      {
        title: title,
        timeDuration: timeDuration,
        description: description,
        videoUrl: updatedSubSectionDetails.secure_url,
      },
      { new: true }
    );

    // return success responce
    return res.status(400).json({
      success: false,
      message: "subsection updated successfully ",
      updatedCourseDetails,
    });

    // return responce
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "subsection updation failed",
    });
  }
};

exports.deleteSubsection = async (req, res) => {
  try {
    // fettch data
    const { subSectionId } = req.body;

    // validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subsection id not present",
      });
    }

    // subsection delete kar do
    const detleteSubSection = await Subsection.findByIdAndDelete(subSectionId);
    // section se bhi id delete kar do bhai
    // await Section.findByIdAndDelete(detleteSubSection._id,subSection);
    await Section.updateOne({ $pull: { subSection: detleteSubSection._id } });

    // return success responce
    return res.status(400).json({
      success: false,
      message: "subsection deleted successfully ",
      updatedCourseDetails,
    });

    // return responce
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "subsection deletion failed",
    });
  }
};
