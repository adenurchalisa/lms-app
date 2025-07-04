const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Course = require('../models/Course');

// Teacher buat quiz di course tertentu
exports.createQuiz = async(req, res) => {
    try {
        // Hanya dosen yang boleh buat quiz
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { courseId } = req.params;
        const { title, description, questions } = req.body;

        // Validasi: pastikan course ada dan user adalah owner
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (String(course.createdBy) !== req.user.userId) {
            return res.status(403).json({ message: 'You are not the course owner' });
        }

        // Buat quiz
        const quiz = new Quiz({
            course: courseId,
            title,
            description,
            questions,
            createdBy: req.user.userId
        });
        await quiz.save();
        res.status(201).json({ message: 'Quiz created', quiz });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student lihat daftar quiz di course tertentu
exports.getQuizzesByCourse = async(req, res) => {
    try {
        const { courseId } = req.params;
        const quizzes = await Quiz.find({ course: courseId }).select('-questions.answer'); // jangan kirim jawaban benar ke student
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student lihat detail 1 quiz (soal-soalnya, tanpa jawaban)
exports.getQuizDetail = async(req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).select('-questions.answer');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student submit jawaban quiz
exports.submitQuiz = async(req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit quiz' });
        }
        const { quizId } = req.params;
        const { answers } = req.body; // array of { questionIndex, selected }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Cek apakah sudah pernah submit
        const existing = await QuizSubmission.findOne({
            quiz: quizId,
            student: req.user.userId
        });
        if (existing) {
            return res.status(400).json({ message: 'You have already submitted this quiz' });
        }

        // Auto scoring
        let score = 0;
        answers.forEach(a => {
            if (
                quiz.questions[a.questionIndex] &&
                quiz.questions[a.questionIndex].answer === a.selected
            ) {
                score++;
            }
        });

        const submission = new QuizSubmission({
            quiz: quizId,
            student: req.user.userId,
            answers,
            score,
            graded: true
        });
        await submission.save();

        // ------- Tambahan progress tracking -------
        // Import progressController secara aman supaya tidak terjadi circular require
        try {
            const progressController = require('./progressController');
            if (progressController && typeof progressController.markQuizDone === "function") {
                await progressController.markQuizDone(req.user.userId, quiz.course, quizId);
            }
        } catch (e) {
            // Optional: log error jika progressController gagal di-load, tapi tidak menggagalkan submit quiz
            console.error('Progress update failed:', e);
        }
        // ------------------------------------------

        res.status(201).json({ message: 'Submission successful', submission });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student lihat hasil quiz yang sudah dia kerjakan
exports.getMySubmission = async(req, res) => {
    try {
        const { quizId } = req.params;
        const submission = await QuizSubmission.findOne({
            quiz: quizId,
            student: req.user.userId
        });
        if (!submission) return res.status(404).json({ message: 'No submission found' });
        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Teacher lihat semua submission (jawaban) student untuk quiz tertentu
exports.getQuizSubmissions = async(req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        if (String(quiz.createdBy) !== req.user.userId) {
            return res.status(403).json({ message: 'You are not the quiz owner' });
        }
        const submissions = await QuizSubmission.find({ quiz: quizId }).populate('student', 'email');
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};