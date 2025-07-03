const mongoose = require("mongoose");
const Material = require("./Material");
const Enrollment = require("./Enrollment");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  materials: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Material.deleteMany({ course: doc._id });

    await Enrollment.findByIdAndUpdate(doc._id, {
      $pull: {
        course: doc._id,
      },
    });
  }
});

module.exports = mongoose.model("Course", courseSchema);
