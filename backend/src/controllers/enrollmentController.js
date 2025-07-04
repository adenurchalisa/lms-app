const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Student join course
exports.enrollCourse = async(req, res) => {
    try {
        if (req.user.role !== "student") {
            return res
                .status(403)
                .json({ message: "Hanya student yang bisa enroll course" });
        }

        const { courseId } = req.params;

        // Pastikan course-nya ada
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course tidak ditemukan" });
        }

        // Temukan enrollment user
        let enrollment = await Enrollment.findOne({ user: req.user.userId });

        if (!enrollment) {
            // Kalau belum ada, buat dokumen Enrollment kosong
            enrollment = new Enrollment({
                user: req.user.userId,
                enroll: [],
            });
        }

        // Cek apakah sudah pernah join course tersebut
        const alreadyJoined = enrollment.enroll.some(
            (item) => item.course.toString() === courseId
        );

        if (alreadyJoined) {
            return res.status(400).json({ message: "Kamu sudah join course ini" });
        }

        // Tambahkan course baru ke enroll
        enrollment.enroll.push({
            course: courseId,
            enrolledAt: new Date(),
        });

        await enrollment.save();

        // Tambahkan juga ke Course.students
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { students: req.user.userId },
        });

        res.status(201).json({ message: "Berhasil join course", enrollment });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Kamu sudah join course ini" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Melihat semua course yang sudah di-enroll oleh student
exports.getMyCourses = async(req, res) => {
    try {
        const enrollments = await Enrollment.find({
            user: req.user.userId,
        }).populate("course");
        const courses = enrollments.map((e) => e.course);
        res.json({ courses });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Melihat semua student di suatu course (khusus teacher)
exports.getEnrolledStudents = async(req, res) => {
    try {
        const { courseId } = req.params;

        // Hanya teacher yang boleh akses
        if (req.user.role !== "teacher") {
            return res
                .status(403)
                .json({ message: "Hanya teacher yang bisa melihat daftar student" });
        }

        // (Opsional, lebih aman) Pastikan teacher adalah owner/creator course
        const course = await Course.findById(courseId);
        if (!course)
            return res.status(404).json({ message: "Course tidak ditemukan" });
        if (course.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Kamu bukan owner course ini" });
        }

        const enrollments = await Enrollment.find({ "enroll.course": courseId }).populate(
            "user",
            "email"
        );
        const students = enrollments.map((e) => e.user);
        res.json({ students });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getTeacherDashboardStats = async(req, res) => {
    try {
        const teacherId = req.user.userId;

        // 1. Ambil semua course milik teacher
        const courses = await Course.find({ createdBy: teacherId }, "_id");
        const courseIds = courses.map((c) => c._id);
        const totalCourses = courseIds.length;

        // 2. Ambil total student unik yang join ke course tersebut
        const studentAgg = await Enrollment.aggregate([
            { $unwind: "$enroll" },
            {
                $match: {
                    "enroll.course": { $in: courseIds },
                },
            },
            {
                $group: {
                    _id: "$user",
                },
            },
            {
                $count: "total",
            },
        ]);

        const totalStudents = studentAgg[0] ? studentAgg[0].total : 0;

        // 3. Statistik jumlah student per hari yang join
        const dailyStats = await Enrollment.aggregate([
            { $unwind: "$enroll" },
            {
                $match: {
                    "enroll.course": { $in: courseIds },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$enroll.enrolledAt",
                        },
                    },
                    total: { $addToSet: "$user" },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    total: { $size: "$total" },
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        // 4. Hitung Growth Rate (per hari)
        let growthRate = 0;
        if (dailyStats.length >= 2) {
            // Ambil data hari ini dan kemarin
            const today = dailyStats[dailyStats.length - 1];
            const yesterday = dailyStats[dailyStats.length - 2];

            const todayEnrollments = today ? today.total : 0;
            const yesterdayEnrollments = yesterday ? yesterday.total : 0;

            if (yesterdayEnrollments > 0) {
                growthRate = ((todayEnrollments - yesterdayEnrollments) / yesterdayEnrollments) * 100;
            } else if (todayEnrollments > 0) {
                growthRate = 100; // 100% growth jika dari 0 ke angka positif
            }

            // Round ke 1 desimal
            growthRate = Math.round(growthRate * 10) / 10;
        }

        // 5. Kirim hasil response lengkap
        res.json({
            totalCourses,
            totalStudents,
            dailyStats,
            growthRate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil statistik dashboard" });
    }
};

exports.getStudentCourses = async(req, res) => {
    try {
        console.log("getStudentCourses called for user:", req.user.userId);

        const studentId = req.user.userId;

        if (!studentId) {
            console.log("No student ID found in request");
            return res.status(400).json({ message: "Student ID tidak ditemukan" });
        }

        const enrollment = await Enrollment.findOne({ user: studentId }).populate(
            "enroll.course"
        );

        if (!enrollment || enrollment.enroll.length === 0) {
            console.log("No enrollment found, returning empty courses");
            return res.json({ courses: [] });
        }

        const courses = enrollment.enroll.map((item) => {
            if (!item.course) {
                console.log("Course not found for enrollment item, skipping");
                return null;
            }
            return {
                _id: item.course._id,
                title: item.course.title,
            };
        }).filter(course => course !== null);

        console.log("Returning", courses.length, "courses");
        res.json({ courses });
    } catch (err) {
        console.error("Error in getStudentCourses:", err.message);
        res.status(500).json({ message: "Gagal mengambil course student", error: err.message });
    }
};

exports.getStudentOverview = async(req, res) => {
    try {
        const studentId = req.user.userId;

        // Get student's enrolled courses
        const enrollment = await Enrollment.findOne({ user: studentId }).populate({
            path: "enroll.course",
            populate: {
                path: "materials",
                model: "Material",
            },
        });

        if (!enrollment) {
            return res.json({
                totalCoursesEnrolled: 0,
                totalMaterials: 0,
                recentCourses: [],
                enrollmentProgress: [],
            });
        }

        const enrolledCourses = enrollment.enroll.map((item) => item.course);
        const totalCoursesEnrolled = enrolledCourses.length;

        // Calculate total materials across all courses
        const totalMaterials = enrolledCourses.reduce(
            (total, course) => total + (course.materials ? course.materials.length : 0),
            0
        );

        // Get recent courses (last 3)
        const recentCourses = enrollment.enroll
            .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
            .slice(0, 3)
            .map((item) => ({
                _id: item.course._id,
                title: item.course.title,
                description: item.course.description,
                enrolledAt: item.enrolledAt,
                materialCount: item.course.materials ? item.course.materials.length : 0,
            }));

        // Create enrollment progress data (enrollment per month)
        const enrollmentProgress = enrollment.enroll
            .reduce((acc, item) => {
                const date = new Date(item.enrolledAt);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;

                const existing = acc.find((entry) => entry.month === monthYear);
                if (existing) {
                    existing.count += 1;
                } else {
                    acc.push({ month: monthYear, count: 1 });
                }

                return acc;
            }, [])
            .sort((a, b) => a.month.localeCompare(b.month));

        res.json({
            totalCoursesEnrolled,
            totalMaterials,
            recentCourses,
            enrollmentProgress,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil overview student" });
    }
};

exports.getEnrolledCoursesDetailed = async(req, res) => {
    try {
        const studentId = req.user.userId;

        const enrollment = await Enrollment.findOne({ user: studentId }).populate({
            path: "enroll.course",
            populate: [{
                    path: "materials",
                    model: "Material",
                },
                {
                    path: "createdBy",
                    model: "User",
                    select: "email",
                },
            ],
        });

        if (!enrollment || enrollment.enroll.length === 0) {
            return res.json({ courses: [] });
        }

        const detailedCourses = enrollment.enroll.map((item) => ({
            _id: item.course._id,
            title: item.course.title,
            description: item.course.description,
            enrolledAt: item.enrolledAt,
            materialCount: item.course.materials ? item.course.materials.length : 0,
            instructor: item.course.createdBy.email,
            createdAt: item.course.createdAt,
        }));

        res.json({ courses: detailedCourses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil detail courses student" });
    }
};