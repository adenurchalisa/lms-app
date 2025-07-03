module.exports = function(roles = []) {
    // roles param bisa string ('teacher') atau array (['teacher', 'admin'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses ditolak: role tidak sesuai' });
        }
        next();
    };
};