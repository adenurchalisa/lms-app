require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const courseRoutes = require('./routes/course');
const materialRoutes = require('./routes/material');
const enrollmentRoutes = require('./routes/enrollment');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', materialRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', quizRoutes);
app.use('/api', progressRoutes);


// Test route
app.get('/', (req, res) => {
    res.send('LMS Backend is running!');
});

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Terhubung ke MongoDB!');
        app.listen(process.env.PORT, () => {
            console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Gagal konek MongoDB:', error.message);
    });