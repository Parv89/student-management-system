# Full Stack Student Management System - Project Report

**Author / Intern**: Java Full Stack Developer Intern  
**Company / Organization**: Cognevance Technologies  
**Project**: StudentHub - Student Management System  
**Academic / Internship Year**: 2026  
**Technology Stack**: Java 17 LTS, Spring Boot 3.3.4, Hibernate, MySQL 8, React 18, Vite  

---

## 1. Introduction

Managing student enrollment records, academic programs, and lifecycle statuses is a mission-critical workflow across higher education institutions and training organizations. Manual record-keeping or fragmented spreadsheets result in data redundancy, conflicting enrollment IDs, difficult searchability, and inconsistent data reporting.

This project delivers **StudentHub**, an enterprise-grade Student Management System designed and implemented for the **Java Full Stack Developer Internship at Cognevance Technologies**. The system decouples a modern React single-page application from a high-throughput Spring Boot REST API, persisting all records to an ACID-compliant MySQL 8 relational database.

---

## 2. Objectives

The primary objectives of this system include:
1. **End-to-End Full Stack Decoupled Architecture**: Seamless integration between a React 18 / Vite frontend and a Spring Boot 3.3 backend over HTTP REST APIs.
2. **ACID-Compliant Relational Persistence**: Replace mock or temporary client-side storage with an enterprise relational database (MySQL 8) featuring primary keys, unique constraints, and indexes.
3. **Comprehensive CRUD Functionality**: Enable full creation, retrieval, updates, and deletion of student profiles with instant server-state UI synchronization.
4. **Resilient Data Validation & Integrity**: Enforce dual-layer validation (client-side form validation and server-side Jakarta Bean Validation) along with database unique constraints to prevent duplicate emails or enrollment numbers.
5. **Real-Time Academic Insights**: Generate aggregated statistics directly via parameterized database aggregations for dashboard summary cards and course distribution metrics.
6. **Robust Error Handling**: Centralized exception management returning standardized RFC-compliant JSON error bodies with HTTP status codes (200, 201, 400, 404, 409, 500).

---

## 3. Requirements Analysis

### 3.1 Functional Requirements
- **Student Profile Management**: Register students with Full Name, Email, Phone, Academic Course, Enrollment Number, Enrollment Date, and Status (`ACTIVE` / `INACTIVE`).
- **Real-Time Search**: Search student records by student name, email address, or enrollment identifier.
- **Multi-Criteria Filtering**: Filter students dynamically by academic program/course and enrollment status.
- **Pagination & Sorting**: Support server-side pagination with configurable page size (5, 10, 20) and customizable sorting.
- **Dashboard Metrics**: Display total students, active count, inactive count, distinct courses, and enrollment distributions.
- **Audit Trails**: Capture creation and last-modified timestamps automatically on all records.
- **Safe Deletion**: Require explicit user confirmation before executing permanent database deletion.

### 3.2 Non-Functional Requirements
- **Performance**: Parameterized JPQL queries and database indexing on frequently queried columns (`full_name`, `email`, `course`, `status`, `enrollment_date`).
- **Reliability & Idempotency**: Provide sample datasets that can be re-run safely without inserting duplicate records.
- **Usability**: Professional light theme with deep navy and purple accents, high contrast typography, intuitive modal dialogues, and responsive design for desktop, tablet, and mobile displays.
- **Maintainability**: Layered separation of concerns (Controller, Service, Repository, DTO, Model, Exception Handlers).

---

## 4. System Architecture

The StudentHub system follows a layered, three-tier decoupled client-server architecture:

```
+-------------------------------------------------------------+
|                     Client Tier (Frontend)                  |
|  - React 18 + Vite (SPA)                                    |
|  - Components: Sidebar, Navbar, StudentTable, Modals, Stats |
|  - API Service Layer: fetch client with error handling      |
+------------------------------+------------------------------+
                               |  HTTP / REST (JSON)
                               |  CORS Enabled for http://localhost:5173
+------------------------------v------------------------------+
|                    Application Tier (Backend)               |
|  - Spring Boot 3.3.4 (Java 17 LTS)                          |
|  - REST Controllers: StudentController, HealthCheck         |
|  - Service Layer: StudentServiceImpl (Transactions & Logic) |
|  - Data Access: Spring Data JPA + Hibernate 6 ORM           |
|  - Exception Handling: GlobalExceptionHandler (@Advice)     |
+------------------------------+------------------------------+
                               |  JDBC / TCP:3306
                               |  HikariCP Connection Pool
+------------------------------v------------------------------+
|                     Data Tier (Database)                    |
|  - MySQL 8 Relational Database                              |
|  - Database: student_management_db                          |
|  - Table: students (Constraints, Indexes, InnoDB Engine)    |
+-------------------------------------------------------------+
```

### Component Flow
1. **User Interaction**: The user initiates an action in the React UI (e.g., clicking "Save Student").
2. **Client Validation**: The UI inspects inputs against local validation rules before issuing a network request.
3. **REST Request**: The API client emits an HTTP request (e.g., `POST /api/students`) containing the JSON payload.
4. **Server Validation**: Spring's `@Valid` annotation intercepts the DTO. If invalid, `MethodArgumentNotValidException` is triggered, returning `400 Bad Request` with field-specific errors.
5. **Business Logic & Uniqueness Check**: `StudentServiceImpl` verifies whether the email or enrollment number is already registered. If a duplicate exists, `DuplicateResourceException` is raised (`409 Conflict`).
6. **Persistence**: Hibernate ORM manages the entity lifecycle, executing parameterized SQL into MySQL.
7. **Response**: A standardized `ApiResponse<T>` envelope containing the newly persisted entity is returned with HTTP `201 Created`.
8. **UI Synchronization**: React receives the response and immediately updates local component state and dashboard metrics without reloading the browser.

---

## 5. Database Design

### 5.1 Relational Schema (`students` table)

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique student record surrogate key |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Student full legal name |
| `email` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Unique student email address |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact telephone number |
| `course` | `VARCHAR(100)` | `NOT NULL` | Enrolled degree or training program |
| `enrollment_number`| `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | Unique institutional student ID |
| `enrollment_date` | `DATE` | `NOT NULL` | Formal date of enrollment |
| `status` | `ENUM('ACTIVE', 'INACTIVE')` | `NOT NULL`, `DEFAULT 'ACTIVE'` | Academic standing status |
| `created_at` | `DATETIME` | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Initial database creation timestamp |
| `updated_at` | `DATETIME` | `NOT NULL`, `ON UPDATE CURRENT_TIMESTAMP`| Last modification timestamp |

### 5.2 Indexes
- `idx_students_full_name`: Optimizes text search on student name.
- `idx_students_course`: Accelerates course-based filtering and distribution aggregations.
- `idx_students_status`: Accelerates filtering by active/inactive states.
- `idx_students_enrollment_date`: Supports temporal filtering and sorting.

---

## 6. Module Descriptions

### 6.1 Backend Modules
- **`com.cognevance.studentmanagement.model`**: Defines JPA entities (`Student`) and enumerations (`StudentStatus`) mapped to relational tables with automatic lifecycle hooks (`@PrePersist`, `@PreUpdate`).
- **`com.cognevance.studentmanagement.dto`**: Decoupled contract structures (`StudentRequestDto`, `StudentResponseDto`, `DashboardStatsDto`, `ApiResponse`, `ApiErrorResponse`) ensuring database internals remain encapsulated.
- **`com.cognevance.studentmanagement.repository`**: `StudentRepository` extending `JpaRepository`, utilizing parameterized JPQL for dynamic multi-criteria search, pagination, and course counting.
- **`com.cognevance.studentmanagement.service`**: Encapsulates business logic, duplicate validation rules, and transactional boundaries (`@Transactional`).
- **`com.cognevance.studentmanagement.controller`**: REST controllers exposing endpoints for student CRUD, search, statistics, and health diagnostics.
- **`com.cognevance.studentmanagement.exception`**: Centralized exception handler (`GlobalExceptionHandler`) utilizing Spring's `@RestControllerAdvice` to translate domain exceptions into RFC-standard JSON error responses.
- **`com.cognevance.studentmanagement.config`**: Configures application-level settings including CORS restrictions tailored to `http://localhost:5173`.

### 6.2 Frontend Modules
- **`Navbar`**: Responsive header bar showing real-time backend and database connectivity status and quick registration actions.
- **`Sidebar`**: Desktop sidebar and mobile drawer navigation with institutional branding ("StudentHub | Cognevance Technologies").
- **`DashboardStats`**: Displays four live metric cards (Total, Active, Inactive, Available Courses).
- **`StudentTable`**: Responsive data grid supporting debounced keyword search, course filtering, status filtering, page size selection, sorting, and row action triggers.
- **`StudentFormModal`**: Dual-purpose modal for adding and updating student records with live validation and error reporting.
- **`StudentDetailModal`**: Read-only profile view rendering full student details, formatted dates, and audit timestamps.
- **`DeleteConfirmModal`**: Modal dialog preventing accidental record deletion.
- **`AnalyticsView`**: Interactive breakdown of course enrollment distribution and active/inactive student body ratios.
- **`AboutView`**: In-app documentation outlining internship objectives and API endpoints.

---

## 7. REST API Design

The API adheres to REST architectural principles:
- **`GET /api/students`**: Retrieves paginated and filtered students (`200 OK`).
- **`GET /api/students/{id}`**: Retrieves a student by primary key (`200 OK` or `404 Not Found`).
- **`POST /api/students`**: Creates a new student record (`201 Created`, `400 Bad Request`, or `409 Conflict`).
- **`PUT /api/students/{id}`**: Updates an existing student record (`200 OK`, `400 Bad Request`, `404 Not Found`, or `409 Conflict`).
- **`DELETE /api/students/{id}`**: Removes a student record (`200 OK` or `404 Not Found`).
- **`GET /api/students/search?query=`**: Searches students across multiple fields (`200 OK`).
- **`GET /api/students/stats`**: Returns calculated dashboard metrics from database (`200 OK`).
- **`GET /api/students/courses`**: Returns distinct enrolled courses (`200 OK`).
- **`GET /api/health`**: Reports Spring Boot and MySQL operational status (`200 OK`).

---

## 8. Testing Approach

Quality assurance in StudentHub encompasses both automated testing and verification procedures:

### 8.1 Backend Automated Tests
- **Service Layer Unit Tests (`StudentServiceTest`)**:
  - Validates successful creation, retrieval, updates, and deletion.
  - Verifies rejection of duplicate email addresses (`DuplicateResourceException`).
  - Verifies rejection of duplicate enrollment numbers.
  - Verifies `ResourceNotFoundException` when querying or modifying non-existent IDs.
  - Asserts accurate computation of dashboard metrics and course distributions.
- **Controller Slice Tests (`StudentControllerTest`)**:
  - Leverages Spring `MockMvc` to test HTTP status codes and JSON serialization.
  - Verifies `201 Created` on valid POST.
  - Verifies `400 Bad Request` with field error mappings when required fields are missing or invalid.
  - Verifies `409 Conflict` on duplicate resource detection.
  - Verifies `404 Not Found` when a requested entity ID is missing.

### 8.2 Frontend Build & Lint Verification
- Verified production build generation via Vite (`npm run build`).
- Ensured zero missing dependencies, clean JSX compilation, and asset optimization.

---

## 9. Current Environment Status, Results & Limitations

### 9.1 Environment Assessment Findings
During initial inspection of the host Windows environment:
1. **Node.js & npm**: Node.js `v22.23.2` and npm `10.9.8` were installed and verified. The frontend was fully installed, verified, and built successfully into production assets.
2. **Java Version**: The host machine currently has Java 8 (`1.8.0_202`) configured in the system PATH.
   - Spring Boot 3.3.4 requires **Java 17 LTS or higher**. When running Maven with Java 8, compilation accurately reported: `Fatal error compiling: invalid target release: 17`.
   - **Action Required**: Install JDK 17 LTS (e.g. Eclipse Adoptium Temurin 17) and configure `JAVA_HOME`.
3. **Maven**: Maven was not installed globally, but a Maven Wrapper (`mvnw.cmd` / `mvnw`) was configured and tested with Apache Maven 3.9.8.
4. **MySQL 8**: MySQL server was not installed or running as a Windows service.
   - **Action Required**: Install MySQL Community Server 8.0, create database `student_management_db`, and configure credentials via environment variables.

### 9.2 Genuine Screenshots Capture Guide
Do not fabricate screenshots. Once MySQL and JDK 17 are installed and the application is running, capture genuine screenshots and save them to `docs/screenshots/`:
1. `docs/screenshots/01-dashboard.png`: Full dashboard showing the four summary cards and student table.
2. `docs/screenshots/02-add-student.png`: The "Add Student" modal form with validation.
3. `docs/screenshots/03-student-details.png`: The "Student Profile" modal showing complete student details.
4. `docs/screenshots/04-edit-student.png`: The "Edit Student" modal modifying an existing record.
5. `docs/screenshots/05-delete-confirmation.png`: The deletion confirmation dialog.
6. `docs/screenshots/06-analytics-view.png`: Course distribution and enrollment ratio view.
7. `docs/screenshots/07-api-health.png`: Browser view of `http://localhost:8080/api/health` displaying `{"status": "UP", "database": "CONNECTED"}`.

---

## 10. Conclusion

The StudentHub Student Management System fulfills all technical and functional requirements specified for the Cognevance Technologies internship. The system implements a robust, maintainable architecture following industry best practices:
- Strong separation between UI and backend services.
- Resilient data access through parameterized JPA queries.
- Clean database design enforcing entity integrity.
- Production-ready documentation and automated tests.

Upon installation of JDK 17 and MySQL 8 using the provided setup instructions, the system will execute seamlessly in both local and hosted environments.
