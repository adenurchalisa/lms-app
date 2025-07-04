# 📡 LMS API Documentation

## Base Information

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json` (except file uploads)
- **API Version**: v1.0.0

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account (teacher or student).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Validation Rules:**
- `name`: Required, min 2 characters, max 50 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `role`: Required, must be "teacher" or "student"

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60d5ecb54545a6001f000001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2025-07-03T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}

// 500 - Server Error
{
  "message": "Server error",
  "error": "Internal server error message"
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "60d5ecb54545a6001f000001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 401 - Invalid Credentials
{
  "message": "Invalid email or password"
}

// 404 - User Not Found
{
  "message": "User not found"
}
```

---

## 📚 Course Endpoints

### Get All Courses
**GET** `/courses`

Retrieve all courses available in the system.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "courses": [
    {
      "_id": "60d5ecb54545a6001f000002",
      "title": "React Fundamentals",
      "description": "Learn React from scratch",
      "teacher": {
        "_id": "60d5ecb54545a6001f000001",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "materials": [
        "60d5ecb54545a6001f000003",
        "60d5ecb54545a6001f000004"
      ],
      "students": [
        "60d5ecb54545a6001f000005"
      ],
      "createdAt": "2025-07-01T00:00:00.000Z",
      "updatedAt": "2025-07-01T00:00:00.000Z"
    }
  ]
}
```

### Get Teacher's Courses
**GET** `/courses/my-courses`

Retrieve courses created by the authenticated teacher.

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Access:** Teacher only

**Success Response (200):**
```json
{
  "courses": [
    {
      "_id": "60d5ecb54545a6001f000002",
      "title": "React Fundamentals",
      "description": "Learn React from scratch",
      "materials": ["materialId1", "materialId2"],
      "students": ["studentId1", "studentId2"],
      "createdAt": "2025-07-01T00:00:00.000Z"
    }
  ]
}
```

### Create Course
**POST** `/courses`

Create a new course (teacher only).

**Headers:**
```
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

**Access:** Teacher only

**Request Body:**
```json
{
  "title": "React Fundamentals",
  "description": "Learn React from scratch"
}
```

**Validation Rules:**
- `title`: Required, min 1 character, max 100 characters
- `description`: Required, min 1 character, max 500 characters

**Success Response (201):**
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "60d5ecb54545a6001f000002",
    "title": "React Fundamentals",
    "description": "Learn React from scratch",
    "teacher": "60d5ecb54545a6001f000001",
    "materials": [],
    "students": [],
    "createdAt": "2025-07-03T10:30:00.000Z"
  }
}
```

### Get Course Details
**GET** `/courses/:id`

Get detailed information about a specific course.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Course ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "course": {
    "_id": "60d5ecb54545a6001f000002",
    "title": "React Fundamentals",
    "description": "Learn React from scratch",
    "teacher": {
      "_id": "60d5ecb54545a6001f000001",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "materials": [
      {
        "_id": "60d5ecb54545a6001f000003",
        "title": "Introduction to React",
        "content": "http://localhost:5000/uploads/materials/content-1625097600000-123456789.pdf",
        "createdBy": {
          "_id": "60d5ecb54545a6001f000001",
          "name": "Teacher Name"
        },
        "createdAt": "2025-07-01T00:00:00.000Z"
      }
    ],
    "students": [
      {
        "_id": "60d5ecb54545a6001f000005",
        "name": "Student Name",
        "email": "student@example.com"
      }
    ],
    "createdAt": "2025-07-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 404 - Course Not Found
{
  "message": "Course not found"
}

// 403 - Access Denied (for student trying to access non-enrolled course)
{
  "message": "You are not enrolled in this course"
}
```

### Update Course
**PUT** `/courses/:id`

Update course information (only by course creator).

**Headers:**
```
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

**Access:** Course creator only

**URL Parameters:**
- `id`: Course ID

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated course description"
}
```

**Success Response (200):**
```json
{
  "message": "Course updated successfully",
  "course": {
    "_id": "60d5ecb54545a6001f000002",
    "title": "Updated Course Title",
    "description": "Updated course description",
    "updatedAt": "2025-07-03T10:35:00.000Z"
  }
}
```

### Delete Course
**DELETE** `/courses/:id`

Delete a course (only by course creator).

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Access:** Course creator only

**URL Parameters:**
- `id`: Course ID

**Success Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

**Error Responses:**
```json
// 403 - Unauthorized
{
  "message": "Only course creator can delete this course"
}

// 404 - Course Not Found
{
  "message": "Course not found"
}
```

---

## 📄 Material Endpoints

### Create Material
**POST** `/courses/:courseId/materials`

Upload a new material to a course (teacher only).

**Headers:**
```
Authorization: Bearer <teacher_token>
Content-Type: multipart/form-data
```

**Access:** Teacher only

**URL Parameters:**
- `courseId`: Course ID

**Request Body (Form Data):**
```
title: "Introduction to React"
content: [PDF File]
```

**File Requirements:**
- File type: PDF only
- Max size: 10MB
- Required field

**Success Response (201):**
```json
{
  "message": "Materi berhasil dibuat",
  "material": {
    "_id": "60d5ecb54545a6001f000003",
    "title": "Introduction to React",
    "content": "http://localhost:5000/uploads/materials/content-1625097600000-123456789.pdf",
    "course": "60d5ecb54545a6001f000002",
    "createdBy": "60d5ecb54545a6001f000001",
    "createdAt": "2025-07-03T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "message": "Title wajib diisi"
}

// 400 - No File
{
  "message": "File content wajib diupload"
}
```

### Get Course Materials
**GET** `/courses/:courseId/materials`

Get all materials for a specific course.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `courseId`: Course ID

**Access Control:**
- Teachers: Can access any course materials
- Students: Can only access materials from enrolled courses

**Success Response (200):**
```json
{
  "materials": [
    {
      "_id": "60d5ecb54545a6001f000003",
      "title": "Introduction to React",
      "content": "http://localhost:5000/uploads/materials/content-1625097600000-123456789.pdf",
      "course": "60d5ecb54545a6001f000002",
      "createdBy": {
        "_id": "60d5ecb54545a6001f000001",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "createdAt": "2025-07-01T00:00:00.000Z"
    }
  ]
}
```

### Get Material Details
**GET** `/materials/:id`

Get detailed information about a specific material.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Material ID

**Success Response (200):**
```json
{
  "material": {
    "_id": "60d5ecb54545a6001f000003",
    "title": "Introduction to React",
    "content": "http://localhost:5000/uploads/materials/content-1625097600000-123456789.pdf",
    "course": "60d5ecb54545a6001f000002",
    "createdBy": {
      "_id": "60d5ecb54545a6001f000001",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "createdAt": "2025-07-01T00:00:00.000Z"
  }
}
```

### Update Material
**PUT** `/materials/:id`

Update material information or replace the file (creator only).

**Headers:**
```
Authorization: Bearer <teacher_token>
Content-Type: multipart/form-data
```

**Access:** Material creator only

**URL Parameters:**
- `id`: Material ID

**Request Body (Form Data):**
```
title: "Updated Material Title"  // optional
content: [New PDF File]          // optional
```

**Note:** At least one field (title or content) must be provided.

**Success Response (200):**
```json
{
  "message": "Materi berhasil diupdate",
  "material": {
    "_id": "60d5ecb54545a6001f000003",
    "title": "Updated Material Title",
    "content": "http://localhost:5000/uploads/materials/content-1625097700000-987654321.pdf",
    "updatedAt": "2025-07-03T10:35:00.000Z"
  }
}
```

**Error Responses:**
```json
// 403 - Unauthorized
{
  "message": "Hanya creator yang boleh mengedit materi ini"
}

// 400 - No Updates
{
  "message": "Minimal salah satu field (title atau file) harus diisi untuk update"
}
```

### Delete Material
**DELETE** `/materials/:id`

Delete a material (creator only).

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Access:** Material creator only

**URL Parameters:**
- `id`: Material ID

**Success Response (200):**
```json
{
  "message": "Materi berhasil dihapus"
}
```

---

## 🎓 Enrollment Endpoints

### Enroll in Course
**POST** `/courses/:id/enroll`

Enroll student in a course.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Access:** Student only

**URL Parameters:**
- `id`: Course ID

**Success Response (201):**
```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "_id": "60d5ecb54545a6001f000006",
    "user": "60d5ecb54545a6001f000005",
    "course": "60d5ecb54545a6001f000002",
    "enrolledAt": "2025-07-03T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Already Enrolled
{
  "message": "You are already enrolled in this course"
}

// 404 - Course Not Found
{
  "message": "Course not found"
}
```

### Get Student Overview
**GET** `/student/overview`

Get dashboard overview data for student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Access:** Student only

**Success Response (200):**
```json
{
  "totalCourses": 5,
  "totalMaterials": 15,
  "recentCourses": 2,
  "enrollmentProgress": [
    {
      "month": "2025-06",
      "count": 2
    },
    {
      "month": "2025-07",
      "count": 3
    }
  ],
  "enrolledCourses": [
    {
      "_id": "60d5ecb54545a6001f000002",
      "title": "React Fundamentals",
      "teacher": "Teacher Name",
      "materialsCount": 5,
      "enrolledAt": "2025-07-01T00:00:00.000Z"
    }
  ]
}
```

### Get Enrolled Courses (Detailed)
**GET** `/student/courses/detailed`

Get detailed information about courses student is enrolled in.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Access:** Student only

**Success Response (200):**
```json
{
  "courses": [
    {
      "_id": "60d5ecb54545a6001f000002",
      "title": "React Fundamentals",
      "description": "Learn React from scratch",
      "teacher": {
        "_id": "60d5ecb54545a6001f000001",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "materialsCount": 5,
      "enrolledAt": "2025-07-01T00:00:00.000Z"
    }
  ]
}
```

---

## 📊 Overview Endpoints

### Get Teacher Overview
**GET** `/overview`

Get dashboard overview data for teacher.

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Access:** Teacher only

**Success Response (200):**
```json
{
  "totalCourses": 3,
  "totalStudents": 25,
  "courses": [
    {
      "_id": "60d5ecb54545a6001f000002",
      "title": "React Fundamentals",
      "studentsCount": 10,
      "materialsCount": 5
    }
  ],
  "dailyEnrollmentStats": [
    {
      "date": "2025-07-01",
      "total": 3
    },
    {
      "date": "2025-07-02",
      "total": 5
    },
    {
      "date": "2025-07-03",
      "total": 2
    }
  ]
}
```

---

## 🔒 Middleware & Security

### Authentication Middleware
All protected routes use JWT authentication middleware:

```javascript
// Headers required for protected routes
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Role-based Authorization
Some endpoints require specific roles:

- **Teacher only**: Course creation, material management, teacher overview
- **Student only**: Course enrollment, student overview
- **Both**: Course viewing, material viewing (with restrictions)

### CORS Configuration
API accepts requests from configured frontend URL:
```javascript
// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
];
```

---

## 📝 Error Handling

### Standard Error Response Format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)",
  "statusCode": 400
}
```

### Common HTTP Status Codes:

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side errors |

### Validation Errors:
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## 🚀 Rate Limiting

### Default Limits:
- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 10 requests per 15 minutes per IP
- **File upload**: 5 requests per minute per user

### Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1625097600
```

---

## 📋 API Testing

### Using cURL:

#### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Courses:
```bash
curl -X GET http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Upload Material:
```bash
curl -X POST http://localhost:5000/api/courses/COURSE_ID/materials \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Test Material" \
  -F "content=@/path/to/file.pdf"
```

### Using Postman:

1. **Import Collection**: Create a new collection for LMS API
2. **Environment Variables**: Set up variables for:
   - `baseUrl`: http://localhost:5000/api
   - `token`: {{token}} (auto-updated from login response)
3. **Pre-request Scripts**: Auto-include token in headers
4. **Tests**: Add response validation scripts

### Example Postman Collection:
```json
{
  "info": {
    "name": "LMS API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

## 🔄 API Versioning

### Current Version: v1.0.0
- All endpoints are currently unversioned
- Future versions will use URL versioning: `/api/v2/...`

### Backward Compatibility:
- Current endpoints will be maintained for at least 6 months after new version release
- Deprecation notices will be provided in response headers

---

## 📚 SDK & Client Libraries

### JavaScript/TypeScript Client:
```javascript
// Example API client
class LMSApiClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
  
  // Course methods
  async getCourses() {
    return this.request('/courses');
  }
  
  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }
}

// Usage
const api = new LMSApiClient('http://localhost:5000/api', 'your-token');
const courses = await api.getCourses();
```

---

## 📞 Support

For API-related questions or issues:

- **Documentation**: [GitHub Wiki](https://github.com/adenurchalisa/lms-app/wiki)
- **Issues**: [GitHub Issues](https://github.com/adenurchalisa/lms-app/issues)
- **Email**: muslikhahmad8@gmail.com

---

**Last Updated**: July 3, 2025  
**API Version**: 1.0.0
