const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/dashboard', auth, (req, res) => {
    res.json({ message: `Halo ${req.user.userId}, kamu berhasil mengakses dashboard yang diproteksi!`, role: req.user.role });
});

module.exports = router;