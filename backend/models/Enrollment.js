const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); // 1 user tidak bisa join course yang sama 2x

module.exports = mongoose.model('Enrollment', enrollmentSchema);