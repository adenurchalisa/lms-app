require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");

async function createEnrollment() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Find student adit
        const student = await User.findOne({ email: "adit@mail.com" });
        if (!student) {
            console.log("Student adit@mail.com not found");
            return;
        }

        // Find a course
        const course = await Course.findOne({});
        if (!course) {
            console.log("No course found");
            return;
        }

        // Check if enrollment already exists
        let enrollment = await Enrollment.findOne({ user: student._id });

        if (!enrollment) {
            // Create new enrollment
            enrollment = new Enrollment({
                user: student._id,
                enroll: []
            });
        }

        // Check if already enrolled in this course
        const alreadyEnrolled = enrollment.enroll.some(
            item => item.course.toString() === course._id.toString()
        );

        if (!alreadyEnrolled) {
            enrollment.enroll.push({
                course: course._id,
                enrolledAt: new Date()
            });
            await enrollment.save();

            // Also add to course.students
            await Course.findByIdAndUpdate(course._id, {
                $addToSet: { students: student._id }
            });

            console.log(`Student ${student.email} enrolled in course ${course.title}`);
        } else {
            console.log(`Student ${student.email} already enrolled in course ${course.title}`);
        }

        // Check final result
        const finalEnrollment = await Enrollment.findOne({ user: student._id }).populate("enroll.course");
        console.log("Final enrollment:", finalEnrollment);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

createEnrollment();