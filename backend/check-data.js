require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check users
        const users = await User.find({}, "email role");
        console.log("Users:", users);

        // Check courses
        const courses = await Course.find({}, "title createdBy");
        console.log("Courses:", courses);

        // Check enrollments
        const enrollments = await Enrollment.find({}).populate("user", "email");
        console.log("Enrollments:", enrollments);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkData();