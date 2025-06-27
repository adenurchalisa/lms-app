const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const auth = require('../middleware/auth');
const role = require('../middleware/role'); // Tambahkan ini

// Buat materi (POST) /api/courses/:courseId/materials - hanya teacher
router.post('/courses/:courseId/materials', auth, role('teacher'), materialController.createMaterial);

// Lihat semua materi di 1 course (GET) - semua user login
router.get('/courses/:courseId/materials', auth, materialController.getMaterials);

// Lihat detail materi (GET) - semua user login
router.get('/materials/:id', auth, materialController.getMaterial);

// Update materi (PUT) /api/materials/:id - hanya teacher
router.put('/materials/:id', auth, role('teacher'), materialController.updateMaterial);

// Hapus materi (DELETE) /api/materials/:id - hanya teacher
router.delete('/materials/:id', auth, role('teacher'), materialController.deleteMaterial);

module.exports = router;