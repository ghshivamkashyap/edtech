const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true,
  },
  courseDescription: {
    type: String,
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingandReviews",
    },
  ],
  price: {
    type: Number,
  },
  picture: {
    type: String,
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
});

module.exports = mongoose.model("Course", courseSchema);
