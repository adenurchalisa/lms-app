const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');

// Ambil progres mahasiswa pada 1 course (materi dibaca, quiz dikerjakan, persentase)
exports.getProgressByCourse = async(req, res) => {
    try {
        const { courseId } = req.params;

        // Cari data progres
        let progress = await Progress.findOne({
            student: req.user._id,
            course: courseId
        });

        // Hitung jumlah total materi & quiz pada course
        const totalMaterials = await Material.countDocuments({ course: courseId });
        const totalQuizzes = await Quiz.countDocuments({ course: courseId });

        // Jika belum ada progres, return kosong
        if (!progress) {
            return res.json({
                materialsRead: [],
                quizzesDone: [],
                materialsProgress: 0,
                quizzesProgress: 0,
                totalMaterials,
                totalQuizzes
            });
        }

        // Hitung persentase progres
        const materialsProgress = totalMaterials > 0 ? (progress.materialsRead.length / totalMaterials) * 100 : 0;
        const quizzesProgress = totalQuizzes > 0 ? (progress.quizzesDone.length / totalQuizzes) * 100 : 0;

        res.json({
            materialsRead: progress.materialsRead,
            quizzesDone: progress.quizzesDone,
            materialsProgress,
            quizzesProgress,
            totalMaterials,
            totalQuizzes
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tandai materi sudah dibaca oleh mahasiswa (POST /courses/:courseId/materials/:materialId/read)
exports.markMaterialRead = async(req, res) => {
    try {
        const { courseId, materialId } = req.params;

        // Cek apakah material memang milik course tsb
        const material = await Material.findOne({ _id: materialId, course: courseId });
        if (!material) return res.status(404).json({ message: 'Material not found in this course' });

        // Cari progres, jika belum ada, buat baru
        let progress = await Progress.findOne({
            student: req.user._id,
            course: courseId
        });

        if (!progress) {
            progress = new Progress({
                student: req.user._id,
                course: courseId,
                materialsRead: [materialId],
                quizzesDone: []
            });
        } else {
            // Jika belum pernah baca, tambahkan
            if (!progress.materialsRead.includes(materialId)) {
                progress.materialsRead.push(materialId);
            }
        }

        await progress.save();
        res.json({ message: 'Material marked as read', progress });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// (Opsional, bisa panggil ini dari controller quiz) Tambahkan quiz ke quizzesDone saat quiz disubmit
exports.markQuizDone = async(studentId, courseId, quizId) => {
    // Fungsi ini dipakai internal, tidak dipakai endpoint langsung
    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
        progress = new Progress({
            student: studentId,
            course: courseId,
            materialsRead: [],
            quizzesDone: [quizId]
        });
    } else {
        if (!progress.quizzesDone.includes(quizId)) {
            progress.quizzesDone.push(quizId);
        }
    }
    await progress.save();
};