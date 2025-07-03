const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth'); // pastikan middleware auth sudah ada

// Mahasiswa: lihat progres di course tertentu
router.get('/courses/:courseId/progress', auth, progressController.getProgressByCourse);

// Mahasiswa: tandai materi sudah dibaca
router.post('/courses/:courseId/materials/:materialId/read', auth, progressController.markMaterialRead);

module.exports = router;