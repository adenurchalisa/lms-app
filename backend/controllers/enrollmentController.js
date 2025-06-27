const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Student join course
exports.enrollCourse = async(req, res) => {
    try {
        // Hanya student yang boleh enroll!
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Hanya student yang bisa enroll course' });
        }
        const { courseId } = req.params;

        // Pastikan course-nya ada
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course tidak ditemukan' });

        // Cek sudah enroll atau belum (karena ada index unique di model)
        const enrollment = new Enrollment({
            user: req.user.userId,
            course: courseId
        });
        await enrollment.save();
        res.status(201).json({ message: 'Berhasil join course', enrollment });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Kamu sudah join course ini' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Melihat semua course yang sudah di-enroll oleh student
exports.getMyCourses = async(req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.userId }).populate('course');
        const courses = enrollments.map(e => e.course);
        res.json({ courses });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Melihat semua student di suatu course (khusus teacher)
exports.getEnrolledStudents = async(req, res) => {
    try {
        const { courseId } = req.params;

        // Hanya teacher yang boleh akses
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Hanya teacher yang bisa melihat daftar student' });
        }

        // (Opsional, lebih aman) Pastikan teacher adalah owner/creator course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course tidak ditemukan' });
        if (course.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Kamu bukan owner course ini' });
        }

        const enrollments = await Enrollment.find({ course: courseId }).populate('user', 'name email');
        const students = enrollments.map(e => e.user);
        res.json({ students });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};