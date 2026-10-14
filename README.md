# StudentHub - Complete Java Full Stack Student Management System

[![Java 17](https://img.shields.io/badge/Java-17%20LTS-orange.svg)](https://adoptium.net)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)

Enterprise-ready Student Management System built for the **Java Full Stack Developer Internship** at **Cognevance Technologies**.

---

## 1. Project Overview

**StudentHub** is a production-grade student administration platform featuring a decoupled architecture:
- **Frontend**: A modern single-page application built with React 18, Vite, and Lucide React, featuring a clean light theme with deep navy and purple accents.
- **Backend**: A robust RESTful API built with Java 17 LTS, Spring Boot 3.3.4, Hibernate 6, Jakarta Bean Validation, and Spring Boot Actuator.
- **Database**: A persistent relational database powered by MySQL 8 with primary keys, unique constraints, and indexes.

All user actions (create, view, edit, delete, search, filter, paginate, and dashboard analytics) operate directly on live MySQL data through parameterized REST requests.

---

## 2. Key Features

- **Full Student CRUD Lifecycle**:
  - Register new students with automatic timestamping and strict validation.
  - View paginated and sortable student listings.
  - Inspect comprehensive student profiles in a dedicated details modal.
  - Update student contact, program, and enrollment details.
  - Delete students safely with an interactive confirmation modal.
- **Search & Multi-Filter Query Engine**:
  - Real-time debounced keyword search across student name, email, and enrollment ID.
  - Course filter dropdown populated dynamically with enrolled academic programs.
  - Status filter (`ACTIVE` vs `INACTIVE`).
- **Dynamic Server-Calculated Analytics**:
  - Live metric cards: Total Students, Active Students, Inactive Students, Available Courses.
  - Course distribution breakdowns and student body ratios.
- **Data Integrity & Duplicate Prevention**:
  - Dual-layer validation (client-side form validation + server-side Bean Validation).
  - Enforced unique constraints on email and enrollment number (gracefully returns `409 Conflict`).
- **Live Health & Diagnostics**:
  - Top navigation pill displays real-time backend and database connectivity status.
  - Dedicated `/api/health` diagnostic endpoint checking JDBC connection liveness.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5.4, JavaScript (ES6+), HTML5, CSS3, Lucide React icons |
| **Backend** | Java 17 LTS, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Hibernate 6, Bean Validation (Hibernate Validator), Spring Boot Actuator |
| **Build & Tooling** | Apache Maven 3.9 (via included Maven Wrapper `mvnw.cmd` / `mvnw`), npm / Node.js 22 |
| **Database** | MySQL 8.0+ (InnoDB engine, UTF8MB4 charset, HikariCP connection pool) |
| **Testing** | JUnit 5, Mockito, Spring Boot Test, Spring `MockMvc`, Vite production build verification |

---

## 4. Project Structure

```
student-management-system/
├── backend/                               # Spring Boot application
│   ├── .mvn/wrapper/                     # Maven wrapper configuration and JAR
│   ├── mvnw                              # Unix/macOS Maven wrapper script
│   ├── mvnw.cmd                          # Windows Maven wrapper script
│   ├── pom.xml                           # Maven dependencies and build plugins
│   └── src/
│       ├── main/
│       │   ├── java/com/cognevance/studentmanagement/
│       │   │   ├── StudentManagementApplication.java  # Main application entry point
│       │   │   ├── config/               # CORS and web configuration
│       │   │   ├── controller/           # REST endpoints (StudentController, HealthCheck)
│       │   │   ├── dto/                  # Request, Response, Stats, and Error DTOs
│       │   │   ├── exception/            # Centralized exception handler & custom exceptions
│       │   │   ├── model/                # JPA entities (Student) & enums (StudentStatus)
│       │   │   ├── repository/           # Spring Data JPA repositories with JPQL queries
│       │   │   └── service/              # Service interface & transactional implementation
│       │   └── resources/
│       │       └── application.properties # Environment-backed MySQL config
│       └── test/
│           ├── java/com/cognevance/studentmanagement/
│           │   ├── controller/StudentControllerTest.java # MockMvc REST API tests
│           │   └── service/StudentServiceTest.java       # Mockito unit tests
│           └── resources/
│               └── application-test.properties           # Isolated testing configuration
├── frontend/                              # React + Vite application
│   ├── public/
│   │   └── favicon.svg                   # Brand favicon
│   ├── src/
│   │   ├── components/                   # Modular UI components
│   │   │   ├── AboutView.jsx             # Project documentation tab
│   │   │   ├── AnalyticsView.jsx         # Course breakdown and ratios
│   │   │   ├── DashboardStats.jsx        # 4 Summary metric cards
│   │   │   ├── DeleteConfirmModal.jsx    # Safe deletion confirmation
│   │   │   ├── Navbar.jsx                # Header with live health badge & actions
│   │   │   ├── Sidebar.jsx               # Navigation bar & StudentHub branding
│   │   │   ├── StudentDetailModal.jsx    # Complete student profile view
│   │   │   ├── StudentFormModal.jsx      # Add / Edit modal with validation
│   │   │   ├── StudentTable.jsx          # Filterable, paginated data grid
│   │   │   └── Toast.jsx                 # Notification toasts
│   │   ├── services/
│   │   │   └── api.js                    # Fetch API client
│   │   ├── styles/
│   │   │   └── index.css                 # Custom navy/purple design system
│   │   ├── App.jsx                       # Root view and state manager
│   │   └── main.jsx                      # Vite entry point
│   ├── .env.example                      # Frontend environment template
│   ├── index.html                        # HTML template
│   ├── package.json                      # Dependencies and scripts
│   └── vite.config.js                    # Dev server and reverse proxy settings
├── database/
│   ├── schema.sql                        # MySQL DDL table definition & indexes
│   └── sample-data.sql                   # Idempotent fictional sample dataset (10 students)
├── docs/
│   ├── screenshots/                      # Application screenshots
│   ├── API_DOCUMENTATION.md              # Detailed REST API request/response specification
│   └── PROJECT_REPORT.md                 # Full internship submission report
├── .env.example                          # Root environment template
├── .gitignore                            # Git ignore rules for build, secrets, and IDE files
├── setup-database.bat                    # Windows database initialization helper
├── start-backend.bat                     # Windows Spring Boot startup helper
└── start-frontend.bat                    # Windows React/Vite startup helper
```

---

## 5. Prerequisites & Environment Setup

Before running the application on Windows, verify your installed tools.

### 5.1 Environment Check
Open PowerShell or Command Prompt and run:
```powershell
java -version
node -v
npm -v
mysql --version
```

### 5.2 Java 17 LTS Installation (Required)
Spring Boot 3.3.4 requires **Java 17 LTS or higher** (Java 8 cannot compile or run Spring Boot 3 applications).

1. Download **Eclipse Adoptium Temurin 17 (LTS)** installer:
   - Official URL: [https://adoptium.net/temurin/releases/?version=17](https://adoptium.net/temurin/releases/?version=17)
   - Or install via Windows Package Manager:
     ```powershell
     winget install EclipseAdoptium.Temurin.17.JDK
     ```
2. During installation, select the option: **"Set JAVA_HOME variable"** and **"Add to PATH"**.
3. Verify in a new terminal window:
   ```powershell
   java -version
   ```
   Should output `openjdk version "17.0.x"`.

### 5.3 MySQL 8 Installation (Required)
1. Download **MySQL Community Server 8.0**:
   - Official URL: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
   - Or install via winget:
     ```powershell
     winget install Oracle.MySQL
     ```
2. Start the MySQL Windows Service:
   ```powershell
   net start MySQL80
   ```
3. Ensure MySQL's `bin` folder (typically `C:\Program Files\MySQL\MySQL Server 8.0\bin`) is added to your Windows `PATH` environment variable.

---

## 6. Database Setup

### Step 1: Create Database & User
Open MySQL command line client or PowerShell:
```powershell
mysql -u root -p
```
Run the following SQL commands:
```sql
CREATE DATABASE IF NOT EXISTS student_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'student_admin'@'localhost' IDENTIFIED BY 'ChangeMeWithSecurePassword123!';
GRANT ALL PRIVILEGES ON student_management_db.* TO 'student_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Initialize Schema & Sample Data
You can use the provided Windows batch script:
```powershell
.\setup-database.bat
```
Or execute manually with the `mysql` CLI:
```powershell
mysql -u student_admin -p student_management_db < database\schema.sql
mysql -u student_admin -p student_management_db < database\sample-data.sql
```
*Note: `sample-data.sql` uses `ON DUPLICATE KEY UPDATE` and can be run multiple times safely without producing duplicate rows.*

---

## 7. Backend Setup & Startup

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env` or set environment variables in your Windows terminal:
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="student_management_db"
$env:DB_USERNAME="student_admin"
$env:DB_PASSWORD="ChangeMeWithSecurePassword123!"
$env:SERVER_PORT="8080"
```

### Step 2: Start Spring Boot
Using the included Maven Wrapper:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Or double-click the helper script:
```powershell
.\start-backend.bat
```

The Spring Boot backend will start on **`http://localhost:8080`**.

### Step 3: Check Backend Health
Open your browser or run:
```powershell
curl http://localhost:8080/api/health
```
Expected response:
```json
{
  "status": "UP",
  "service": "Cognevance Student Management System API",
  "version": "1.0.0",
  "database": "CONNECTED"
}
```

---

## 8. Frontend Setup & Startup

### Step 1: Install Dependencies
```powershell
cd frontend
npm install
```

### Step 2: Start Development Server
```powershell
npm run dev
```
Or double-click:
```powershell
.\start-frontend.bat
```

The React frontend will be accessible at: **`http://localhost:5173`**.

---

## 9. REST API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & MySQL database connectivity |
| `GET` | `/api/students/stats` | Aggregated dashboard statistics |
| `GET` | `/api/students/courses` | List of distinct enrolled academic programs |
| `GET` | `/api/students` | Paginated, filtered, and sorted student directory |
| `GET` | `/api/students/{id}` | Retrieve individual student record by ID |
| `POST` | `/api/students` | Register a new student (validated) |
| `PUT` | `/api/students/{id}` | Update student record (validated) |
| `DELETE` | `/api/students/{id}` | Delete student record |
| `GET` | `/api/students/search?query=` | Real-time search across name, email, and ID |

For comprehensive JSON request and response payloads, see [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).

---

## 10. Automated Testing

### 10.1 Running Backend Tests
Execute unit and MockMvc integration tests using the Maven wrapper:
```powershell
cd backend
.\mvnw.cmd test
```

Test coverage includes:
- `StudentServiceTest`: Creation, validation, duplicate email/enrollment rejection, update, deletion, search, and dashboard statistics.
- `StudentControllerTest`: HTTP status codes (`200`, `201`, `400`, `404`, `409`), field error mappings, and JSON serialization.

### 10.2 Verifying Frontend Build
```powershell
cd frontend
npm run build
```
Generates an optimized, error-free production bundle in `frontend/dist/`.

---

## 11. Screenshots

Capture screenshots once the application is running locally and place them into `docs/screenshots/`:

| Screenshot | Description | File Location |
|---|---|---|
| Dashboard Overview | Summary cards & student data table | `docs/screenshots/01-dashboard.png` |
| Add Student Modal | Form validation & registration | `docs/screenshots/02-add-student.png` |
| Student Profile | Read-only details with audit stamps | `docs/screenshots/03-student-details.png` |
| Edit Student Modal | Pre-populated update form | `docs/screenshots/04-edit-student.png` |
| Delete Confirmation | Permanent deletion warning dialog | `docs/screenshots/05-delete-confirmation.png` |
| Course Analytics | Program breakdown and ratios | `docs/screenshots/06-analytics-view.png` |
| Health Check API | `/api/health` JSON response | `docs/screenshots/07-api-health.png` |

---

## 12. Production Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push `frontend/` to GitHub.
2. Link the repository in Vercel or Netlify.
3. Configure Build Command: `npm run build` and Output Directory: `dist`.
4. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`.

### Backend Deployment (AWS / Render / Railway)
1. Package the executable JAR:
   ```powershell
   cd backend
   .\mvnw.cmd clean package -DskipTests
   ```
2. Run JAR on server:
   ```bash
   java -jar target/student-management-system-1.0.0.jar
   ```
3. Configure environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS`).

### Database Deployment
1. Provision a managed MySQL 8 instance (e.g. AWS RDS, PlanetScale, Aiven).
2. Execute `database/schema.sql` to initialize tables and indexes.

---

## 13. Troubleshooting Common Errors

### Error: `Fatal error compiling: invalid target release: 17`
- **Cause**: The active Java in PATH is Java 8 (`1.8.0`).
- **Solution**: Install JDK 17 (Temurin 17), set `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`, and restart your terminal.

### Error: `Communications link failure: The last packet sent successfully...`
- **Cause**: MySQL server is not running or port 3306 is inaccessible.
- **Solution**: Open PowerShell as Administrator and run `net start MySQL80`. Check credentials in `application.properties` or environment variables.

### Error: `Access denied for user 'student_admin'@'localhost'`
- **Cause**: Database user does not exist or password mismatch.
- **Solution**: Connect as root (`mysql -u root -p`) and re-run the `CREATE USER` and `GRANT ALL` statements.

### Error: Port 8080 or Port 5173 Already in Use
- **Port 8080**: Change server port via `$env:SERVER_PORT="8081"` or find and kill the process:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process
  ```
- **Port 5173**: Vite will automatically select the next available port (e.g., 5174).

---

## 14. License & Internship Attribution

Developed for the **Cognevance Technologies** Internship Program (2026).  
Licensed under the Apache License, Version 2.0.
