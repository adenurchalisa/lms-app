const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const auth = require("../middleware/auth");

// Student join course
router.post(
    "/courses/:courseId/enroll",
    auth,
    enrollmentController.enrollCourse
);

// Student lihat semua course yg sudah di-enroll
router.get("/my-courses", auth, enrollmentController.getMyCourses);

// Teacher lihat semua student yang enroll di course tertentu
router.get(
    "/courses/:courseId/students",
    auth,
    enrollmentController.getEnrolledStudents
);

router.get(
    "/dashboard/stats",
    auth,
    enrollmentController.getTeacherDashboardStats
);

router.get("/student/courses", auth, enrollmentController.getStudentCourses);

// Student overview dashboard
router.get("/student/overview", auth, enrollmentController.getStudentOverview);

// Student detailed courses
router.get(
    "/student/courses/detailed",
    auth,
    enrollmentController.getEnrolledCoursesDetailed
);

module.exports = router;