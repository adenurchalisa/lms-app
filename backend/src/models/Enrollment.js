const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // opsional, kalau kamu tidak butuh _id di setiap item
);

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enroll: [enrolledCourseSchema],
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
