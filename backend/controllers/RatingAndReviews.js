const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReviews = require("../models/RatingandReviews");

// create rating
exports.createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // get data
    const { rating, review, courseId } = req.body;
    // check if user is enrolled in course or no t
    const courseDetails = await Course.findById({
      _id: userId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "student is not enrolled in course",
      });
    }
    // check ki user ne phle se review de rakha hai  kya.?
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "student already reviewed the course",
      });
    }
    // create review
    const ratingReview = await RatingAndReviews.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });
    // add rating-review in course model also
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      {
        new: true,
      }
    );

    console.log(updatedCourseDetails);
    // return respomce
    return res.status(200).json({
      success: true,
      message: "rating&review submitted",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
// get average rating

exports.getAverageRating = async (req, res) => {
  // get course id
  const courseId = req.body.courseId;
  // calculate average ratings
  const result = await RatingAndReviews.aggregate([
    {
      $match: {
        course: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  //   retuen rating
  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      message: "rating mil gyi hai",
      averageRating: result[0].averageRating,
    });
  }

  //   no rating exists
  return res.status(200).json({
    success: true,
    message: "0 ratings found",
    averageRating: 0,
  });
};

// get all ratings

exports.getAllRatings = async (req, res) => {
  try {
    const allRatings = await RatingAndReviews.find({})
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "firstname lastname email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();

    //   return tresponce
    return res.status(400).json({
      success: false,
      message: "all reviews fetched",
      data: allRatings,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
