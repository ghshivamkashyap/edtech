const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/user");
const mailsender = require("../utils/mailSender");
const {
  courseEnrolmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { json } = require("express");

// capture paymrnt and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  // get courseid and user id from req ki body
  const { course_id } = req.body;
  const user_id = req.user.id;
  // validation
  if (course_id) {
    return res.status(400).json({
      success: false,
      message: "invalid course id",
    });
  }
  // valid course hai ya nahi
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "could not find the course",
      });
    }
    // user ne already buy to nahi kiya huaa hai ?
    const uid = new mongoose.Types.ObjectId(user_id);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "student already enrolled in course",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // order create
  const amount = Course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString,
    notes: {
      course_id: course_id,
      user_id,
    },
  };
  try {
    // initiate payment using razorpay
    const instance = require("../config/razorpay");
    const paymentResponce = await instance.orders.create(options);
    console.log(paymentResponce);

    return res.status(200).json({
      success: true,
      courseName: Course.courseName,
      courseDescription: course.courseDescription,
      picture: course.picture,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

// varify signature handler
exports.verifySignature = async (req, res) => {
  const webhookSecret = "5421";
  const signature = req.headers["x-razorpay-signature"];
  const shaSum = crypto.createHmac("sha256", webhookSecret);
  shaSum.update(JSON.stringify(req.body));
  const digest = shaSum.digest("hex");
  if (signature == digest) {
    console.log("payment is authorised");
    // bache ko course me dal do
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // find course
      // course me student id dal do
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "course not found",
        });
      }

      console.log(enrolledCourse);

      //   student me course id dal do bhai
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { courses: courseId },
        { new: true }
      );
      console.log(enrolledStudent);

      //   mail bhej do bha user ko
      const emailResponce = await mailsender(
        enrolledStudent.email,
        "Enrollment Confirmed! Let's Get Started 🚀📝",
        "🎓 Congratulations! Enrolled in [Course Name] 🌟 Exciting learning ahead with passionate instructors and a supportive community. Mark your calendar for [Course Start Date]. Let's make this journey unforgettable! 🚀📚🌈"
      );

      console.log(emailResponce);
      return res.status(200).json({
        success: true,
        message: "course enrolled success",
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "course not enrolled",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "signature and digest do not match",
    });
  }
};
