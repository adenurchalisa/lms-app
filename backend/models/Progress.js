const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    materialsRead: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Material' }
    ], // Array materi yang sudah dibaca
    quizzesDone: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
        ] // Array quiz yang sudah dikerjakan
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);