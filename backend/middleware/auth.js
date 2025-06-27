const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Ambil token dari header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer token

    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan, akses ditolak!' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // simpan data user di request
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
};