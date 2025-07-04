# 📚 Learning Management System (LMS) - Dokumentasi Lengkap

![LMS Logo](https://img.shields.io/badge/LMS-Learning%20Management%20System-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen?style=for-the-badge)

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Teknologi Stack](#teknologi-stack)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Fitur Utama](#fitur-utama)
5. [Instalasi & Setup](#instalasi--setup)
6. [Konfigurasi](#konfigurasi)
7. [API Documentation](#api-documentation)
8. [Panduan Developer](#panduan-developer)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Kontribusi](#kontribusi)

---

## 🎯 Gambaran Umum

**Learning Management System (LMS)** adalah platform pembelajaran online yang dikembangkan untuk memfasilitasi proses belajar mengajar antara instruktur dan siswa. Sistem ini menyediakan fitur lengkap untuk manajemen kursus, materi pembelajaran, dan tracking progress siswa.

### Tujuan Project:
- 🎓 Menyediakan platform pembelajaran digital yang modern
- 📊 Memberikan analytics dan tracking progress yang detail
- 🔒 Memastikan keamanan data dengan autentikasi yang robust
- 📱 Memberikan pengalaman user yang responsive di semua device

### Target Pengguna:
- **Teacher/Instruktur**: Membuat dan mengelola kursus, materi, dan tracking siswa
- **Student/Siswa**: Mengakses kursus, materi pembelajaran, dan memonitor progress

---

## 🛠️ Teknologi Stack

### Backend Technologies:
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | Latest | Runtime JavaScript |
| **Express.js** | ^5.1.0 | Web framework |
| **MongoDB** | Latest | Database NoSQL |
| **Mongoose** | ^8.16.1 | ODM untuk MongoDB |
| **JWT** | ^9.0.2 | Authentication & Authorization |
| **Bcrypt.js** | ^3.0.2 | Password hashing |
| **Multer** | ^2.0.1 | File upload handling |
| **CORS** | ^2.8.5 | Cross-origin resource sharing |
| **Dotenv** | ^16.6.0 | Environment configuration |

### Frontend Technologies:
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | ^19.1.0 | UI Library |
| **Vite** | Latest | Build tool & dev server |
| **TailwindCSS** | ^4.1.11 | CSS Framework |
| **React Router** | ^7.6.3 | Client-side routing |
| **TanStack Query** | ^5.81.5 | State management & caching |
| **React Hook Form** | ^7.59.0 | Form management |
| **Radix UI** | Various | Accessible UI components |
| **Lucide React** | ^0.525.0 | Icon library |
| **Recharts** | Latest | Data visualization |
| **Sonner** | Latest | Toast notifications |

### Development Tools:
- **Nodemon** | ^3.1.10 | Backend hot reload
- **ESLint** | Latest | Code linting
- **Git** | Latest | Version control

---

## 🏗️ Arsitektur Sistem

### High-Level Architecture:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │────│   Backend API   │────│   Database      │
│   (React)       │    │   (Express.js)  │    │   (MongoDB)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Folder Structure:
```
lms-app/
├── backend/                          # Backend application
│   ├── app.js                       # Main application file
│   ├── package.json                 # Dependencies & scripts
│   ├── .env                         # Environment variables
│   ├── public/
│   │   └── uploads/                 # File upload storage
│   │       └── materials/           # Course materials (PDFs)
│   └── src/
│       ├── controllers/             # Business logic
│       │   ├── authController.js    # Authentication logic
│       │   ├── courseController.js  # Course management
│       │   ├── materialController.js # Material management
│       │   ├── enrollmentController.js # Enrollment logic
│       │   ├── progressController.js # Progress tracking
│       │   └── quizController.js    # Quiz management
│       ├── models/                  # Database schemas
│       │   ├── User.js              # User model
│       │   ├── Course.js            # Course model
│       │   ├── Material.js          # Material model
│       │   ├── Enrollment.js        # Enrollment model
│       │   ├── Progress.js          # Progress model
│       │   ├── Quiz.js              # Quiz model
│       │   └── QuizSubmission.js    # Quiz submission model
│       ├── routes/                  # API routes
│       │   ├── auth.js              # Authentication routes
│       │   ├── course.js            # Course routes
│       │   ├── material.js          # Material routes
│       │   ├── enrollment.js        # Enrollment routes
│       │   ├── progressRoutes.js    # Progress routes
│       │   ├── quizRoutes.js        # Quiz routes
│       │   └── protected.js         # Protected routes
│       ├── middleware/              # Custom middleware
│       │   ├── auth.js              # JWT authentication
│       │   └── role.js              # Role-based authorization
│       └── utils/                   # Utility functions
│           ├── cleanUpFiles.js      # File cleanup utility
│           └── multer.js            # File upload configuration
├── fe_final_BDNR/                   # Frontend application
│   ├── index.html                   # Main HTML file
│   ├── package.json                 # Dependencies & scripts
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # TailwindCSS configuration
│   ├── components.json              # Radix UI configuration
│   ├── public/                      # Static assets
│   └── src/
│       ├── main.jsx                 # Application entry point
│       ├── App.jsx                  # Main app component
│       ├── index.css                # Global styles
│       ├── components/              # Reusable UI components
│       │   ├── ui/                  # Base UI components
│       │   ├── AppSidebar.jsx       # Navigation sidebar
│       │   ├── Layout.jsx           # Page layout wrapper
│       │   ├── LoginForm.jsx        # Login form component
│       │   ├── RegisterForm.jsx     # Registration form
│       │   ├── CreateMaterialForm.jsx # Material creation form
│       │   ├── EditMaterialForm.jsx # Material editing form
│       │   └── DeleteMaterialConfirmation.jsx # Delete confirmation
│       ├── pages/                   # Page components
│       │   ├── LoginPage.jsx        # Login page
│       │   ├── RegisterPage.jsx     # Registration page
│       │   ├── lecturer/            # Teacher pages
│       │   │   ├── Dashboard.jsx    # Teacher dashboard
│       │   │   ├── CoursePage.jsx   # Course listing
│       │   │   ├── CreateCoursePage.jsx # Course creation
│       │   │   └── CourseDetailPage.jsx # Course detail & management
│       │   └── student/             # Student pages
│       │       ├── Dashboard.jsx    # Student dashboard
│       │       ├── AllCoursesPage.jsx # Course discovery
│       │       ├── ProfilePage.jsx  # Student profile
│       │       └── CourseStudentDetailPage.jsx # Course detail for students
│       ├── service/                 # API service functions
│       │   ├── authService.js       # Authentication API calls
│       │   ├── courseService.js     # Course API calls
│       │   ├── materialService.js   # Material API calls
│       │   ├── studentService.js    # Student-specific API calls
│       │   └── overviewService.js   # Dashboard overview API calls
│       ├── guard/                   # Route protection
│       │   ├── StudentPage.jsx      # Student route guard
│       │   └── TeacherPage.jsx      # Teacher route guard
│       ├── hooks/                   # Custom React hooks
│       │   └── use-mobile.js        # Mobile detection hook
│       ├── lib/                     # Utility libraries
│       │   ├── auth.js              # Authentication utilities
│       │   ├── queryClient.js       # React Query configuration
│       │   ├── utils.js             # General utilities
│       │   ├── api/
│       │   │   └── apiInstance.js   # Axios configuration
│       │   └── schema/              # Validation schemas
│       │       ├── courseSchema.js  # Course validation
│       │       ├── LoginSchema.js   # Login validation
│       │       ├── materialSchema.js # Material validation
│       │       └── RegisterSchema.js # Registration validation
│       └── assets/                  # Static assets
├── RANGKUMAN_PENGEMBANGAN_LMS.md    # Development summary
└── README.md                        # Project overview
```

---

## ✨ Fitur Utama

### 👨‍🏫 Fitur Teacher/Instruktur:

#### 🎯 Dashboard & Analytics:
- **Modern Dashboard** dengan statistik real-time
- **Student Enrollment Analytics** dengan visualisasi chart
- **Course Performance Metrics**
- **Growth Rate Indicator** - Tingkat pertumbuhan enrollment siswa
- **Quick Actions** untuk navigasi cepat

#### 📚 Course Management:
- **Create Course** - Membuat kursus baru dengan title dan description
- **Edit Course** - Mengubah informasi kursus
- **Delete Course** - Menghapus kursus (dengan konfirmasi)
- **Course Listing** - Melihat semua kursus yang dibuat

#### 📄 Material Management:
- **Upload Materials** - Upload file PDF sebagai materi pembelajaran
- **Edit Materials** - Mengubah title atau replace file materi
- **Delete Materials** - Menghapus materi dengan konfirmasi
- **Material Preview** - Link preview untuk melihat materi

#### 👥 Student Management:
- **View Enrolled Students** - Melihat daftar siswa yang mendaftar
- **Student Progress Tracking** - Monitoring progress belajar siswa
- **Enrollment Statistics** - Statistik pendaftaran per kursus

### 👨‍🎓 Fitur Student/Siswa:

#### 🏠 Dashboard:
- **Personal Dashboard** dengan overview pembelajaran
- **Learning Progress Chart** - Visualisasi progress belajar
- **Recent Courses** - Kursus yang baru diikuti
- **Statistics Cards** - Total courses, materials, dll

#### 🔍 Course Discovery:
- **Browse All Courses** - Melihat semua kursus yang tersedia
- **Course Enrollment** - Mendaftar ke kursus yang diinginkan
- **Course Details** - Melihat detail kursus sebelum mendaftar
- **Enrollment Status** - Cek status pendaftaran

#### 📖 Learning Experience:
- **Access Course Materials** - Download dan akses materi PDF
- **Course Progress Tracking** - Monitoring progress pembelajaran
- **Course Navigation** - Navigasi mudah antar kursus

#### 👤 Profile Management:
- **Account Information** - Informasi akun pribadi
- **Learning Statistics** - Statistik pembelajaran personal
- **Recent Activity** - Aktivitas pembelajaran terbaru

### 🔒 Sistem Authentication & Authorization:

#### 🔐 Authentication:
- **JWT-based Authentication** - Secure token-based auth
- **Login/Register** - Form autentikasi dengan validasi
- **Password Hashing** - Bcrypt untuk keamanan password
- **Session Management** - Persistent login dengan token refresh

#### 🛡️ Authorization:
- **Role-based Access Control** - Teacher vs Student permissions
- **Protected Routes** - Route protection based on roles
- **API Endpoint Protection** - Middleware untuk protect API
- **Resource Ownership** - User hanya bisa akses resource sendiri

### 📊 Data Visualization & Analytics:

#### 📈 Charts & Graphs:
- **Enrollment Progress Chart** (Bar Chart) - Student dashboard
- **Student Enrollment Trends** (Line Chart) - Teacher dashboard
- **Real-time Statistics** - Live data updates
- **Interactive Visualizations** - Hover effects dan tooltips

#### 📋 Reporting:
- **Course Performance Reports** - Analytics per kursus
- **Student Progress Reports** - Laporan kemajuan siswa
- **Enrollment Analytics** - Statistik pendaftaran
- **Material Usage Statistics** - Tracking penggunaan materi

---

## 🚀 Instalasi & Setup

### Prerequisites:
- **Node.js** (v18 atau lebih baru)
- **MongoDB** (v6 atau lebih baru)
- **Git** (latest version)
- **Text Editor** (VS Code recommended)

### 1. Clone Repository:
```bash
git clone https://github.com/adenurchalisa/lms-app.git
cd lms-app
```

### 2. Backend Setup:
```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit file .env dengan konfigurasi Anda
nano .env
```

### 3. Frontend Setup:
```bash
# Masuk ke folder frontend
cd ../fe_final_BDNR

# Install dependencies
npm install

# (Optional) Build untuk production
npm run build
```

### 4. Database Setup:
```bash
# Pastikan MongoDB berjalan
# Buat database baru (akan otomatis dibuat saat first run)
```

### 5. Run Application:

#### Development Mode:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd fe_final_BDNR
npm run dev
```

#### Production Mode:
```bash
# Backend
cd backend
npm start

# Frontend (build dan serve)
cd fe_final_BDNR
npm run build
npm run preview
```

### 6. Access Application:
- **Frontend**: http://localhost:5173 (development) atau port yang ditampilkan
- **Backend API**: http://localhost:5000
- **MongoDB**: Default port 27017

---

## ⚙️ Konfigurasi

### Backend Environment Variables (`.env`):
```env
# Server Configuration
PORT=5000
APP_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lms_database

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=application/pdf

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration:

#### Vite Config (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

#### API Instance Config (`src/lib/api/apiInstance.js`):
```javascript
import axios from "axios";

export const apiInstanceAuth = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token
apiInstanceAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 📡 API Documentation

### Base URL:
```
http://localhost:5000/api
```

### Authentication Endpoints:

#### POST `/auth/register`
Mendaftarkan user baru (teacher atau student).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // atau "teacher"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

#### POST `/auth/login`
Login untuk teacher atau student.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

### Course Endpoints:

#### GET `/courses`
Mendapatkan semua kursus (untuk student dan teacher).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "courses": [
    {
      "_id": "courseId",
      "title": "React Fundamentals",
      "description": "Learn React from scratch",
      "teacher": {
        "_id": "teacherId",
        "name": "Teacher Name"
      },
      "materials": ["materialId1", "materialId2"],
      "students": ["studentId1", "studentId2"],
      "createdAt": "2025-07-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/courses`
Membuat kursus baru (hanya teacher).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "React Fundamentals",
  "description": "Learn React from scratch"
}
```

#### PUT `/courses/:id`
Mengupdate kursus (hanya teacher yang membuat).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description"
}
```

#### DELETE `/courses/:id`
Menghapus kursus (hanya teacher yang membuat).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

#### GET `/courses/:id`
Mendapatkan detail kursus beserta materials.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "course": {
    "_id": "courseId",
    "title": "React Fundamentals",
    "description": "Learn React from scratch",
    "teacher": {
      "_id": "teacherId",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "materials": [
      {
        "_id": "materialId",
        "title": "Introduction to React",
        "content": "http://localhost:5000/uploads/materials/file.pdf",
        "createdAt": "2025-07-01T00:00:00.000Z"
      }
    ],
    "students": [
      {
        "_id": "studentId",
        "name": "Student Name",
        "email": "student@example.com"
      }
    ]
  }
}
```

### Material Endpoints:

#### POST `/courses/:courseId/materials`
Upload materi ke kursus (hanya teacher).

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: "Introduction to React"
content: [PDF File]
```

#### PUT `/materials/:id`
Update materi (hanya creator).

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: "Updated Material Title"  // optional
content: [New PDF File]          // optional
```

#### DELETE `/materials/:id`
Hapus materi (hanya creator).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### Enrollment Endpoints:

#### POST `/courses/:id/enroll`
Mendaftar ke kursus (hanya student).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

#### GET `/student/overview`
Mendapatkan overview dashboard untuk student.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "totalCourses": 5,
  "totalMaterials": 15,
  "recentCourses": 2,
  "enrollmentProgress": [
    {
      "month": "2025-07",
      "count": 3
    }
  ],
  "enrolledCourses": [
    {
      "_id": "courseId",
      "title": "Course Title",
      "teacher": "Teacher Name"
    }
  ]
}
```

#### GET `/student/courses/detailed`
Mendapatkan detail kursus yang diikuti student.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### Teacher Overview Endpoints:

#### GET `/overview`
Mendapatkan overview dashboard untuk teacher.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "totalCourses": 3,
  "totalStudents": 25,
  "courses": [
    {
      "_id": "courseId",
      "title": "Course Title",
      "studentsCount": 10,
      "materialsCount": 5
    }
  ],
  "dailyEnrollmentStats": [
    {
      "date": "2025-07-01",
      "total": 5
    }
  ]
}
```

---

## 💻 Panduan Developer

### Code Structure & Best Practices:

#### Backend Structure:
```javascript
// Controller Pattern Example
const courseController = {
  // GET /courses
  getCourses: async (req, res) => {
    try {
      const courses = await Course.find()
        .populate('teacher', 'name email')
        .populate('materials');
      
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};
```

#### Frontend Structure:
```jsx
// Component Pattern Example
const Dashboard = () => {
  // State management
  const [data, setData] = useState(null);
  
  // API calls dengan React Query
  const { data: overview, isLoading, error } = useQuery({
    queryKey: ['teacher-overview'],
    queryFn: getOverview
  });
  
  // Loading state
  if (isLoading) return <LoadingSpinner />;
  
  // Error state
  if (error) return <ErrorMessage error={error} />;
  
  // Main render
  return (
    <div className="dashboard">
      <StatisticsCards data={overview} />
      <ChartsSection data={overview.dailyStats} />
    </div>
  );
};
```

### State Management:

#### React Query Configuration:
```javascript
// lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
});
```

#### Custom Hooks:
```javascript
// Custom hook untuk course management
const useCourseManagement = () => {
  const queryClient = useQueryClient();
  
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Course created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  });
  
  return {
    createCourse: createCourseMutation.mutateAsync,
    isCreating: createCourseMutation.isPending
  };
};
```

### Form Validation:

#### Zod Schema Example:
```javascript
// lib/schema/courseSchema.js
import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
});
```

#### React Hook Form Integration:
```jsx
const CreateCourseForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(courseSchema)
  });
  
  const onSubmit = async (data) => {
    try {
      await createCourse(data);
      reset();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <textarea {...register('description')} />
      {errors.description && <span>{errors.description.message}</span>}
      
      <button type="submit">Create Course</button>
    </form>
  );
};
```

### Error Handling:

#### Global Error Boundary:
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### File Upload Handling:

#### Multer Configuration:
```javascript
// utils/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/materials/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'content-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});
```

---

## 🧪 Testing

### Unit Testing Setup:

#### Backend Testing (Jest + Supertest):
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

#### Frontend Testing (Vitest + React Testing Library):
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### Test Examples:

#### Backend API Test:
```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  test('POST /api/auth/register should create new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.email).toBe(userData.email);
  });
});
```

#### Frontend Component Test:
```javascript
// __tests__/LoginForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../components/LoginForm';

describe('LoginForm', () => {
  test('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  test('submits form with correct data', () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

---

## 🚀 Deployment

### Production Deployment:

#### 1. Environment Setup:
```bash
# Production .env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db/lms
JWT_SECRET=your-super-secure-jwt-secret
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

#### 2. Backend Deployment (PM2):
```bash
# Install PM2 globally
npm install -g pm2

# Build and start with PM2
npm run build
pm2 start app.js --name "lms-backend"

# Setup PM2 startup
pm2 startup
pm2 save
```

#### 3. Frontend Deployment:
```bash
# Build for production
npm run build

# Serve with static server
npm install -g serve
serve -s dist -l 3000
```

#### 4. Nginx Configuration:
```nginx
# /etc/nginx/sites-available/lms
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location /uploads {
        alias /path/to/backend/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Deployment:

#### Backend Dockerfile:
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile:
```dockerfile
# fe_final_BDNR/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose:
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/lms
    depends_on:
      - mongo
    volumes:
      - ./backend/public/uploads:/app/public/uploads

  frontend:
    build: ./fe_final_BDNR
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## 🛠️ Troubleshooting

### Common Issues:

#### 1. MongoDB Connection Error:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Pastikan MongoDB service berjalan
- Check connection string di `.env`
- Verify network connectivity

#### 2. JWT Token Expired:
```
Error: jwt expired
```
**Solution:**
- Implement token refresh mechanism
- Check JWT_EXPIRES_IN configuration
- Clear localStorage dan login ulang

#### 3. File Upload Error:
```
Error: LIMIT_FILE_SIZE
```
**Solution:**
- Check file size (max 10MB)
- Verify file type (only PDF allowed)
- Check multer configuration

#### 4. CORS Error:
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Update CORS configuration di backend
- Check FRONTEND_URL di environment variables
- Verify request headers

#### 5. Build Errors:
```
Module not found: Error: Can't resolve '@/components'
```
**Solution:**
- Check Vite path alias configuration
- Verify import paths
- Clear node_modules dan reinstall

### Performance Optimization:

#### 1. Database Optimization:
```javascript
// Add indexes untuk better performance
Course.index({ teacher: 1 });
Enrollment.index({ user: 1, course: 1 });
Material.index({ course: 1 });
```

#### 2. Frontend Optimization:
```javascript
// Code splitting dengan React.lazy
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Memoization untuk expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

#### 3. Caching Strategy:
```javascript
// API response caching
const getCourses = async () => {
  const cached = localStorage.getItem('courses');
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data;
  }
  
  const response = await apiInstanceAuth.get('/courses');
  localStorage.setItem('courses', {
    data: response.data,
    timestamp: Date.now()
  });
  
  return response.data;
};
```

---

## 🤝 Kontribusi

### Cara Berkontribusi:

1. **Fork** repository ini
2. **Create branch** untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Code Style Guidelines:

#### JavaScript/React:
- Gunakan ES6+ syntax
- Prefer arrow functions
- Use async/await over promises
- Follow React hooks best practices
- Add PropTypes atau TypeScript untuk type safety

#### CSS/TailwindCSS:
- Use utility-first approach
- Maintain consistent spacing (rem units)
- Follow mobile-first responsive design
- Use semantic class names untuk custom components

#### Git Commit Guidelines:
```
feat: add new dashboard analytics
fix: resolve authentication bug
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for auth service
```

### Issue Reporting:
Jika menemukan bug atau ingin request fitur baru, silakan buat issue dengan template:

```markdown
## Bug Report / Feature Request

### Description
[Describe the bug or feature]

### Steps to Reproduce (for bugs)
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### Expected Behavior
[What you expected to happen]

### Screenshots
[If applicable, add screenshots]

### Environment
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Team

- **Lead Developer**: [Ahmad Muslikh](https://github.com/ahmadmuslikh)
- **Frontend Developer**: [Aden Ur Chalisa](https://github.com/adenurchalisa)
- **Backend Developer**: [Contributor Name]
- **UI/UX Designer**: [Contributor Name]

---

## 📞 Support

Jika membutuhkan bantuan atau memiliki pertanyaan:

- **Email**: muslikhahmad8@gmail.com
- **GitHub Issues**: [Create New Issue](https://github.com/adenurchalisa/lms-app/issues)
- **Documentation**: [Wiki Page](https://github.com/adenurchalisa/lms-app/wiki)

---

## 🔄 Changelog

### Version 1.0.0 (Juli 2025)
- ✅ Initial release
- ✅ Complete authentication system
- ✅ Teacher dashboard dengan course management
- ✅ Student dashboard dengan course discovery
- ✅ Material management (CRUD operations)
- ✅ Real-time analytics dan reporting
- ✅ Responsive design untuk mobile dan desktop
- ✅ Production-ready deployment

---

**© 2025 LMS Team. All rights reserved.**
