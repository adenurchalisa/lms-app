const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionIndex: { type: Number, required: true },
    selected: { type: Number, required: true } // index pilihan yang dipilih student
});

const quizSubmissionSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [answerSchema],
    score: { type: Number },
    graded: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);