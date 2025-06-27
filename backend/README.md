# LMS Backend

Backend RESTful API untuk aplikasi **Learning Management System (LMS)**, mendukung dua role utama: **Dosen** dan **Mahasiswa**.

---

## Fitur Utama

- **Autentikasi JWT** (Register & Login mahasiswa/dosen)
- **Manajemen Course:** Buat, edit, hapus, lihat course (dosen)
- **Materi:** Tambah, edit, hapus, lihat materi per course (dosen & mahasiswa)
- **Quiz:** Buat, edit, hapus, lihat quiz per course (dosen), submit quiz (mahasiswa)
- **Submission & Nilai Otomatis:** Mahasiswa submit quiz, nilai otomatis
- **Progress Tracking:** Mahasiswa bisa cek progres belajar pada setiap course
- **Role-based Access Control:** Hak akses sesuai role (dosen/mahasiswa)

---

## Struktur Proyek

```
backend/
│
├── controllers/
│   ├── userController.js
│   ├── courseController.js
│   ├── materialController.js
│   ├── quizController.js
│   └── progressController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Material.js
│   ├── Quiz.js
│   ├── QuizSubmission.js
│   └── Progress.js
│
├── routes/
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── materialRoutes.js
│   ├── quizRoutes.js
│   └── progressRoutes.js
│
├── .env.example
├── package.json
└── server.js
```

---

## Cara Menjalankan

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Buat file `.env`** dari `.env.example`  
   Contoh isi:
   ```
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. **Jalankan server**
   ```bash
   npm start
   ```

---

## Dokumentasi Endpoint Utama

### Autentikasi

- **POST `/api/register`**  
  Register user baru (dosen/mahasiswa)
- **POST `/api/login`**  
  Login, dapatkan token JWT

### Course

- **GET `/api/courses`**  
  Lihat daftar course
- **POST `/api/courses`**  
  Buat course baru (khusus dosen)
- **GET `/api/courses/:id`**  
  Detail course

### Material

- **GET `/api/courses/:courseId/materials`**  
  Daftar materi pada course
- **POST `/api/courses/:courseId/materials`**  
  Tambah materi (dosen)
- **POST `/api/courses/:courseId/materials/:materialId/read`**  
  Tandai materi sudah dibaca (mahasiswa)

### Quiz

- **GET `/api/courses/:courseId/quizzes`**  
  Daftar quiz pada course
- **POST `/api/courses/:courseId/quizzes`**  
  Buat quiz (dosen)
- **POST `/api/quizzes/:quizId/submit`**  
  Submit jawaban quiz (mahasiswa)
- **GET `/api/quizzes/:quizId/my-submission`**  
  Cek hasil quiz sendiri

### Progress

- **GET `/api/courses/:courseId/progress`**  
  Lihat progres belajar pada course

---

## Catatan

- Semua endpoint (kecuali register/login) wajib menggunakan header:  
  ```
  Authorization: Bearer <token>
  ```
- Dosen hanya bisa edit/hapus resource yang dia buat.
- Mahasiswa hanya bisa mengakses/submit quiz/materi pada course yang diikuti.
- Semua response error dalam format:
  ```json
  { "message": "error description" }
  ```

---

## Kontribusi

Pull request dan saran sangat diterima!  
Untuk pertanyaan teknis, silakan hubungi maintainer repo ini.

---
