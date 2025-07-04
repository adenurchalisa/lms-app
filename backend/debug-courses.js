const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./src/models/Course');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async() => {
    console.log('Connected to MongoDB');
    const courses = await Course.find().populate('students', 'name email');
    console.log('All courses with students:');
    courses.forEach(course => {
        console.log(`Course: ${course.title}`);
        console.log(`Students: ${JSON.stringify(course.students, null, 2)}`);
        console.log('---');
    });
    process.exit();
});