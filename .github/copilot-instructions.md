# Schools24 Backend - Comprehensive Development Guidelines

This document provides high-context technical guidelines for the Schools24 backend. All development should follow these architectural decisions, patterns, and security practices.

---

## 🏗️ Architecture Design (Monolith 2.0)

For Schools24, we focus on **Extreme Cost Optimization** and **Single-Instance Stability**.

- **Pattern**: Single Go Monolith (Modularized).
- **Web Framework**: [Gin](https://github.com/gin-gonic/gin) (Fast, memory-efficient).
- **Caching**: **In-memory** using [BigCache](https://github.com/allegro/bigcache) with optional Snappy compression.
- **API Gateway**: Integrated directly into Go (Middleware-based). KrakenD removed to save RAM.
- **Service Mesh/K8s**: Removed. Replaced with single Docker container deployment on Oracle ARM ($0/month).

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|:---|:---|:---|
| **Language** | Go 1.22+ | Performance, simplicity, small footprint. |
| **Relational DB** | **Neon PostgreSQL** | Primary data (users, finance, academics). |
| **Document DB** | **MongoDB Atlas** | Quizzes, question banks, unstructured logs. |
| **Authentication**| **JWT** (RS256/HS256) | Stateless session management. |
| **Deployment** | **Oracle ARM / Render** | Hosting targets (24GB vs 500MB RAM). |

---

## 📂 Project Structure (Modular 4-Layer Architecture)

We use a strict 4-layer separation within each module found in `internal/modules/`:

1.  **Models (`models.go`)**: Defines GORM/DB tags, JSON tags, and Request/Response DTOs.
2.  **Repository (`repository.go`)**: Pure database logic (`pgx` or `mongo-driver`). No business logic here.
3.  **Service (`service.go`)**: Business logic, validation, and cross-repository orchestration.
4.  **Handler (`handler.go`)**: Gin HTTP handlers. Parses input, calls Service, returns JSON.

### Core Modules
- `auth`: Registration, Login, Profile, JWT Lifecycle.
- `student`: Dashboard, Attendance, Academic progress.
- `academic`: Timetables, Homework (CRUD), Grades, Subjects.
- `teacher`: Dashboard (Assignments), Grade Entry, Attendance Marking.
- `admin`: User CRUD, Student/Teacher onboarding, Fee Structures, Payments, Audit Logs.

---

## 🛡️ Middlewares & Security

- **JWT Auth**: Every protected request must carry `Authorization: Bearer <token>`.
- **RBAC (Role-Based Access Control)**: Strictly enforced via `middleware.RequireRole("admin", "teacher", ...)`.
- **Rate Limiting**: Token bucket (Limiter) implemented in `middleare.RateLimit` to prevent Brute-force/DoS.
- **CORS**: Configurable via ENV to allow specific frontend origins.

---

## 💾 Database & Migrations

**Auto-Migrations** are handled on startup via `db.RunMigrations(ctx)`. 
- SQL-based migrations: `internal/shared/database/migrations_<module>.go`.
- Table count: ~20 tables (users, classes, homework, payments, etc.).

---

## 🚀 API Endpoint Reference (38 Total)

### Admin (Control Plane)
- `GET /admin/dashboard`: Global stats.
- `POST /admin/users`: Manual user creation.
- `POST /admin/students`: Guided student onboarding (User + Profile).
- `GET /admin/fees/structures`: Configure school fee items.
- `POST /admin/payments`: Record school fee collection.

### Teacher (Academic Management)
- `GET /teacher/dashboard`: Assigned classes & schedule.
- `POST /teacher/attendance`: Mark class attendance.
- `POST /teacher/homework`: Create homework tasks (MongoDB stored).
- `POST /teacher/grades`: Record student marks.

---

## 📋 Coding Guidelines

1.  **Error Handling**: Always return appropriate HTTP status codes:
    - 400: Validation/Input error.
    - 401: Missing/Invalid token.
    - 403: Role mismatch.
    - 404: Resource not found.
    - 500: System/Database error.
2.  **Concurrency**: Use Gin's context carefully. Never use `c.Request.Context()` for long-running tasks after the request completes.
3.  **Clean Code**:
    - Repository methods should take `context.Context` as the first argument.
    - Services should return custom errors defined at the top of the file (e.g., `ErrUserNotFound`).
4.  **No Logic in Handlers**: Handlers should be < 20 lines. Offload all logic to Service.

---

## 🏗️ Deployment Workflow

1.  **Local Dev**: `go run ./cmd/server/main.go` using local `.env`.
2.  **Oracle Cloud (ARM)**: 
    - Cross-compile locally: `GOOS=linux GOARCH=arm64 go build ...`
    - Upload binary and `.env`.
    - Run via `systemd` (See `ORACLE_DEPLOYMENT.md`).
3.  **Render**:
    - Uses `render.yaml` Blueprint.
    - Optimized for **500MB RAM** (Low-memory mode enabled).

---

## 🔗 Environment Variables Checklist

```env
# Essential
DATABASE_URL=postgres://...
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super_secret_key

# Tuning
CACHE_MAX_SIZE_MB=256
RATE_LIMIT_REQUESTS_PER_MIN=100
GIN_MODE=release
```
