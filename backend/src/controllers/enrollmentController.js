const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Student join course
exports.enrollCourse = async (req, res) => {
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
exports.getMyCourses = async (req, res) => {
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
exports.getEnrolledStudents = async (req, res) => {
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

    const enrollments = await Enrollment.find({ course: courseId }).populate(
      "user",
      "name email"
    );
    const students = enrollments.map((e) => e.user);
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTeacherDashboardStats = async (req, res) => {
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

    const totalStudents = studentAgg[0]?.total || 0;

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

    // 4. Kirim hasil response lengkap
    res.json({
      totalCourses,
      totalStudents,
      dailyStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil statistik dashboard" });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const enrollment = await Enrollment.findOne({ user: studentId }).populate(
      "enroll.course"
    );

    if (!enrollment || enrollment.enroll.length === 0) {
      return res.json({ courses: [] });
    }

    const courses = enrollment.enroll.map((item) => ({
      _id: item.course._id,
      title: item.course.title,
    }));

    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil course student" });
  }
};
