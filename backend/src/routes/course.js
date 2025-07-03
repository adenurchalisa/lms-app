const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Hanya teacher yang boleh create, update, delete course
router.post("/", auth, role("teacher"), courseController.createCourse);
router.put("/:id/update", auth, role("teacher"), courseController.updateCourse);
router.delete(
  "/:id/delete",
  auth,
  role("teacher"),
  courseController.deleteCourse
);

// Semua user yang login (teacher & student) boleh melihat daftar dan detail course
router.get("/", auth, courseController.getCoursesByTeacher);
router.get("/:id", auth, courseController.getCourse);

module.exports = router;
