const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth'); // middleware autentikasi, pastikan sudah ada

// TEACHER: Buat quiz untuk course
router.post('/courses/:courseId/quizzes', auth, quizController.createQuiz);

// STUDENT & TEACHER: Lihat daftar quiz di course
router.get('/courses/:courseId/quizzes', auth, quizController.getQuizzesByCourse);

// STUDENT: Lihat detail quiz (soal-soal, tanpa kunci jawaban)
router.get('/quizzes/:quizId', auth, quizController.getQuizDetail);

// STUDENT: Submit jawaban quiz
router.post('/quizzes/:quizId/submit', auth, quizController.submitQuiz);

// STUDENT: Lihat hasil quiz yang sudah dikerjakan
router.get('/quizzes/:quizId/mysubmission', auth, quizController.getMySubmission);

// TEACHER: Lihat semua submission quiz
router.get('/quizzes/:quizId/submissions', auth, quizController.getQuizSubmissions);

module.exports = router;