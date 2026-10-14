# Cognevance Technologies - StudentHub REST API Documentation

**Project**: Student Management System  
**Version**: 1.0.0  
**Base URL**: `http://localhost:8080/api`  
**Content-Type**: `application/json`

---

## Overview

The StudentHub API provides a robust RESTful interface for managing student registrations, records, academic programs, and dashboard statistics. All responses follow standardized JSON structures.

---

## 1. Response Formats

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful description",
  "data": { ... },
  "timestamp": "2026-10-14T11:30:00.000"
}
```

### Standard Error Response (4xx / 5xx)
```json
{
  "timestamp": "2026-10-14T11:30:00.000",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed for one or more fields",
  "path": "/api/students",
  "fieldErrors": {
    "email": "Email address must be a valid email format",
    "fullName": "Full name is required"
  }
}
```

---

## 2. API Endpoints

### 2.1 Health Check

#### `GET /api/health`
Checks the operational status of the Spring Boot application and real-time connectivity to the MySQL database.

- **Request Headers**: None
- **Response**: `200 OK`
```json
{
  "status": "UP",
  "timestamp": "2026-10-14T11:30:00.000",
  "service": "Cognevance Student Management System API",
  "version": "1.0.0",
  "database": "CONNECTED"
}
```

---

### 2.2 Dashboard Statistics

#### `GET /api/students/stats`
Returns aggregated counts for dashboard metric cards and course distribution.

- **Request Headers**: None
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalStudents": 10,
    "activeStudents": 8,
    "inactiveStudents": 2,
    "availableCourses": 5,
    "courseDistribution": {
      "Computer Science & Engineering": 3,
      "Data Science & AI": 2,
      "Information Technology": 2,
      "Cybersecurity": 2,
      "Cloud Computing & DevOps": 1
    }
  },
  "timestamp": "2026-10-14T11:30:00.000"
}
```

---

### 2.3 List Available Courses

#### `GET /api/students/courses`
Returns an alphabetical list of distinct courses present in the student records.

- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    "Cloud Computing & DevOps",
    "Computer Science & Engineering",
    "Cybersecurity",
    "Data Science & AI",
    "Information Technology"
  ],
  "timestamp": "2026-10-14T11:30:00.000"
}
```

---

### 2.4 List Students (with Pagination, Search, and Filtering)

#### `GET /api/students`

**Query Parameters**:
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `0` | Zero-based page index |
| `size` | integer | `10` | Records per page (e.g., 5, 10, 20) |
| `sortBy` | string | `id` | Sort property (`id`, `fullName`, `enrollmentNumber`, `enrollmentDate`, `course`) |
| `sortDir` | string | `desc` | Direction (`asc` or `desc`) |
| `query` | string | _optional_ | Case-insensitive search across name, email, or enrollment ID |
| `course` | string | _optional_ | Filter by specific course |
| `status` | string | _optional_ | Filter by status (`ACTIVE` or `INACTIVE`) |

- **Example Request**:
  `GET /api/students?page=0&size=10&course=Data%20Science%20%26%20AI&status=ACTIVE`

- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "content": [
      {
        "id": 2,
        "fullName": "Ananya Patel",
        "email": "ananya.patel@example.com",
        "phone": "+91 98765 43211",
        "course": "Data Science & AI",
        "enrollmentNumber": "STU-2026-002",
        "enrollmentDate": "2026-01-18",
        "status": "ACTIVE",
        "createdAt": "2026-10-14T10:00:00",
        "updatedAt": "2026-10-14T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 1,
    "totalPages": 1,
    "last": true,
    "size": 10,
    "number": 0,
    "first": true,
    "numberOfElements": 1,
    "empty": false
  },
  "timestamp": "2026-10-14T11:30:00.000"
}
```

---

### 2.5 Quick Search Students

#### `GET /api/students/search?query={keyword}`
Searches across `fullName`, `email`, and `enrollmentNumber`.

- **Example Request**:
  `GET /api/students/search?query=Aarav`

- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": 1,
      "fullName": "Aarav Sharma",
      "email": "aarav.sharma@example.com",
      "phone": "+91 98765 43210",
      "course": "Computer Science & Engineering",
      "enrollmentNumber": "STU-2026-001",
      "enrollmentDate": "2026-01-15",
      "status": "ACTIVE",
      "createdAt": "2026-10-14T10:00:00",
      "updatedAt": "2026-10-14T10:00:00"
    }
  ],
  "timestamp": "2026-10-14T11:30:00.000"
}
```

---

### 2.6 Get Student by ID

#### `GET /api/students/{id}`

- **Example Request**: `GET /api/students/1`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "id": 1,
    "fullName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+91 98765 43210",
    "course": "Computer Science & Engineering",
    "enrollmentNumber": "STU-2026-001",
    "enrollmentDate": "2026-01-15",
    "status": "ACTIVE",
    "createdAt": "2026-10-14T10:00:00",
    "updatedAt": "2026-10-14T10:00:00"
  },
  "timestamp": "2026-10-14T11:30:00.000"
}
```

- **Error Response**: `404 Not Found` (when ID does not exist)
```json
{
  "timestamp": "2026-10-14T11:30:00.000",
  "status": 404,
  "error": "Resource Not Found",
  "message": "Student not found with ID: 999",
  "path": "/api/students/999"
}
```

---

### 2.7 Create Student Record

#### `POST /api/students`

- **Request Body**:
```json
{
  "fullName": "Rohan Verma",
  "email": "rohan.verma@example.com",
  "phone": "+91 98765 43212",
  "course": "Information Technology",
  "enrollmentNumber": "STU-2026-003",
  "enrollmentDate": "2026-02-01",
  "status": "ACTIVE"
}
```

- **Validation Rules**:
  - `fullName`: Required, 2 to 100 characters.
  - `email`: Required, valid email format, unique across records.
  - `phone`: Required, valid format (`^[+0-9\-\s()]{7,20}$`).
  - `course`: Required, up to 100 characters.
  - `enrollmentNumber`: Required, unique across records, up to 50 characters.
  - `enrollmentDate`: Required, format `YYYY-MM-DD`.
  - `status`: Required, `ACTIVE` or `INACTIVE`.

- **Success Response**: `201 Created`
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": 3,
    "fullName": "Rohan Verma",
    "email": "rohan.verma@example.com",
    "phone": "+91 98765 43212",
    "course": "Information Technology",
    "enrollmentNumber": "STU-2026-003",
    "enrollmentDate": "2026-02-01",
    "status": "ACTIVE",
    "createdAt": "2026-10-14T11:30:00.000",
    "updatedAt": "2026-10-14T11:30:00.000"
  },
  "timestamp": "2026-10-14T11:30:00.000"
}
```

- **Duplicate Conflict Error Response**: `409 Conflict`
```json
{
  "timestamp": "2026-10-14T11:30:00.000",
  "status": 409,
  "error": "Duplicate Resource",
  "message": "A student with email 'rohan.verma@example.com' already exists.",
  "path": "/api/students"
}
```

- **Validation Failure Error Response**: `400 Bad Request`
```json
{
  "timestamp": "2026-10-14T11:30:00.000",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed for one or more fields",
  "path": "/api/students",
  "fieldErrors": {
    "email": "Email address must be a valid email format",
    "phone": "Phone number must be a valid format (7 to 20 digits, spaces or symbols)"
  }
}
```

---

### 2.8 Update Student Record

#### `PUT /api/students/{id}`

- **Example Request**: `PUT /api/students/1`
- **Request Body**:
```json
{
  "fullName": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "+91 98765 99999",
  "course": "Data Science & AI",
  "enrollmentNumber": "STU-2026-001",
  "enrollmentDate": "2026-01-15",
  "status": "ACTIVE"
}
```

- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "fullName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+91 98765 99999",
    "course": "Data Science & AI",
    "enrollmentNumber": "STU-2026-001",
    "enrollmentDate": "2026-01-15",
    "status": "ACTIVE",
    "createdAt": "2026-10-14T10:00:00",
    "updatedAt": "2026-10-14T11:35:00"
  },
  "timestamp": "2026-10-14T11:35:00.000"
}
```

---

### 2.9 Delete Student Record

#### `DELETE /api/students/{id}`

- **Example Request**: `DELETE /api/students/1`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": null,
  "timestamp": "2026-10-14T11:36:00.000"
}
```

- **Error Response**: `404 Not Found` (if student does not exist)
```json
{
  "timestamp": "2026-10-14T11:36:00.000",
  "status": 404,
  "error": "Resource Not Found",
  "message": "Student not found with ID: 1",
  "path": "/api/students/1"
}
```
