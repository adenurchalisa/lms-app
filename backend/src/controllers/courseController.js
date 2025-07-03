const Course = require("../models/Course");

// Create Course
exports.createCourse = async(req, res) => {
    try {
        // Hanya user yang login (dari middleware auth)
        const { title, description } = req.body;
        const course = new Course({
            title,
            description,
            createdBy: req.user.userId,
        });
        await course.save();
        res.status(201).json({ message: "Course berhasil dibuat", course });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get All Courses
exports.getCourses = async(req, res) => {
    try {
        const courses = await Course.find()
            .populate({
                path: "createdBy",
                select: "_id email",
            })
            .populate({
                path: "materials",
                select: "title content",
            });
        res.json({ courses });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get Single Course
exports.getCourse = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("materials", "title content");

        if (!course)
            return res.status(404).json({ message: "Course tidak ditemukan" });

        res.json({
            course,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get Courses by teacher
exports.getCoursesByTeacher = async(req, res) => {
    try {
        // User ID dari token JWT yang tersimpan di req.user
        const teacherId = req.user.userId;

        // Cari course berdasarkan createdBy yang cocok dengan ID guru
        // Pilih hanya fields yang diinginkan: id, title, dan description
        const courses = await Course.find({ createdBy: teacherId }).select(
            "title description"
        );

        if (courses.length === 0) {
            return res.status(200).json({
                message: "Belum ada course yang dibuat oleh guru ini",
                courses: [],
            });
        }

        res.json({ courses });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Update Course
exports.updateCourse = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course)
            return res.status(404).json({ message: "Course tidak ditemukan" });

        // Optional: hanya creator yang boleh edit
        if (course.createdBy.toString() !== req.user.userId) {
            return res
                .status(403)
                .json({ message: "Hanya creator yang boleh mengedit course ini" });
        }

        course.title = req.body.title || course.title;
        course.description = req.body.description || course.description;
        await course.save();

        res.json({ message: "Course berhasil diupdate", course });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete Course
exports.deleteCourse = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course)
            return res.status(404).json({ message: "Course tidak ditemukan" });

        // Optional: hanya creator yang boleh hapus
        if (course.createdBy.toString() !== req.user.userId) {
            return res
                .status(403)
                .json({ message: "Hanya creator yang boleh menghapus course ini" });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};