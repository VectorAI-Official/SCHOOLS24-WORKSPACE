# 🗄️ Schools24 Database Schema Design

## Executive Summary

This document provides the **complete database schema design** for the Schools24 school management system. The architecture uses a **hybrid database strategy**:

- **PostgreSQL 16**: Relational data with ACID guarantees (35+ tables)
- **MongoDB 7.0**: Flexible schemas for evolving data (5 collections)
- **Redis 7.2**: High-speed cache and session store

---

## 📐 Database Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│            (Go Microservices + Gin Framework)                │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │   MongoDB   │  │    Redis    │
│  (Primary)  │  │ (Documents) │  │   (Cache)   │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🐘 PostgreSQL Schema (Relational Data)

### Connection Configuration

```yaml
Database: schools24_db
Host: localhost (dev) / RDS endpoint (prod)
Port: 5432
Max Connections: 100
Idle Connections: 10
SSL Mode: require (production)
```

### 1. User Management Tables

#### 1.1 `users` (Core user accounts)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'staff', 'parent')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

**Sample Data:**
```sql
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
('admin@schools24.com', '$2a$12$...', 'admin', 'John Smith', '+91-9876543210'),
('teacher1@schools24.com', '$2a$12$...', 'teacher', 'Sarah Johnson', '+91-9876543211'),
('student1@schools24.com', '$2a$12$...', 'student', 'Rahul Kumar', '+91-9876543212');
```

---

#### 1.2 `teachers` (Teacher-specific data)

```sql
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    qualification VARCHAR(255),
    experience_years INT,
    subjects TEXT[], -- Array of subject IDs
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_teachers_employee_id ON teachers(employee_id);
```

**Sample Data:**
```sql
INSERT INTO teachers (user_id, employee_id, department, qualification, experience_years, subjects, hire_date, salary) VALUES
('user-uuid-1', 'EMP001', 'Mathematics', 'M.Sc Mathematics', 8, ARRAY['math', 'physics'], '2018-06-15', 55000.00);
```

---

#### 1.3 `students` (Student profiles)

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    roll_number VARCHAR(50),
    class_id UUID REFERENCES classes(id),
    section VARCHAR(10),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    blood_group VARCHAR(5),
    address TEXT,
    parent_name VARCHAR(255),
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20),
    emergency_contact VARCHAR(20),
    admission_date DATE NOT NULL,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_class_id ON students(class_id);
```

**Sample Data:**
```sql
INSERT INTO students (user_id, admission_number, roll_number, class_id, section, date_of_birth, gender, parent_name, parent_phone, admission_date, academic_year) VALUES
('user-uuid-3', 'ADM2025001', 'ROLL001', 'class-uuid-1', 'A', '2009-05-15', 'male', 'Rajesh Kumar', '+91-9876543213', '2025-04-01', '2025-2026');
```

---

#### 1.4 `staff` (Non-teaching staff)

```sql
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL, -- 'cleaner', 'driver', 'accountant', 'receptionist'
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    duties TEXT, -- Job description
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_user_id ON staff(user_id);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
```

---

### 2. Academic Tables

#### 2.1 `classes` (Class definitions)

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- 'Class 10A', 'Class 9B'
    grade INT NOT NULL, -- 1-12
    section VARCHAR(10), -- 'A', 'B', 'C'
    class_teacher_id UUID REFERENCES teachers(id),
    academic_year VARCHAR(20) NOT NULL,
    total_students INT DEFAULT 0,
    room_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_grade ON classes(grade);
CREATE INDEX idx_classes_academic_year ON classes(academic_year);
```

**Sample Data:**
```sql
INSERT INTO classes (name, grade, section, class_teacher_id, academic_year, total_students, room_number) VALUES
('Class 10A', 10, 'A', 'teacher-uuid-1', '2025-2026', 35, 'R-201'),
('Class 10B', 10, 'B', 'teacher-uuid-2', '2025-2026', 32, 'R-202');
```

---

#### 2.2 `subjects` (Subject catalog)

```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    grade_level INT, -- NULL = all grades
    is_elective BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_code ON subjects(code);
```

**Sample Data:**
```sql
INSERT INTO subjects (name, code, description, grade_level, is_elective) VALUES
('Mathematics', 'MATH10', 'Advanced Mathematics for Class 10', 10, false),
('Physics', 'PHY10', 'Physics fundamentals', 10, false),
('Computer Science', 'CS10', 'Programming basics', 10, true);
```

---

#### 2.3 `timetables` (Class schedules)

```sql
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    period_number INT NOT NULL CHECK (period_number BETWEEN 1 AND 10),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(class_id, day_of_week, period_number, academic_year)
);

CREATE INDEX idx_timetables_class_id ON timetables(class_id);
CREATE INDEX idx_timetables_teacher_id ON timetables(teacher_id);
```

**Sample Data:**
```sql
INSERT INTO timetables (class_id, subject_id, teacher_id, day_of_week, period_number, start_time, end_time, room_number, academic_year) VALUES
('class-uuid-1', 'subject-uuid-1', 'teacher-uuid-1', 1, 1, '08:00', '08:45', 'R-201', '2025-2026'),
('class-uuid-1', 'subject-uuid-2', 'teacher-uuid-2', 1, 2, '08:50', '09:35', 'R-201', '2025-2026');
```

---

#### 2.4 `homework` (Assignments)

```sql
CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    file_url TEXT, -- S3 URL
    due_date TIMESTAMP NOT NULL,
    total_marks INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_homework_class_id ON homework(class_id);
CREATE INDEX idx_homework_teacher_id ON homework(teacher_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);
```

**Sample Data:**
```sql
INSERT INTO homework (title, description, class_id, subject_id, teacher_id, file_url, due_date, total_marks) VALUES
('Quadratic Equations - Chapter 5', 'Solve problems 1-10 from textbook page 45', 'class-uuid-1', 'subject-uuid-1', 'teacher-uuid-1', 'https://s3.amazonaws.com/schools24/hw_12345.pdf', '2025-11-25 23:59:59', 20);
```

---

#### 2.5 `homework_submissions` (Student submissions)

```sql
CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    file_url TEXT, -- S3 URL of submitted file
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks_obtained INT,
    feedback TEXT,
    graded_at TIMESTAMP,
    graded_by UUID REFERENCES teachers(id),
    is_late BOOLEAN DEFAULT false,
    
    UNIQUE(homework_id, student_id)
);

CREATE INDEX idx_homework_submissions_homework_id ON homework_submissions(homework_id);
CREATE INDEX idx_homework_submissions_student_id ON homework_submissions(student_id);
```

**Sample Data:**
```sql
INSERT INTO homework_submissions (homework_id, student_id, file_url, submitted_at, is_late) VALUES
('hw-uuid-1', 'student-uuid-1', 'https://s3.amazonaws.com/schools24/submissions/sub_001.pdf', '2025-11-24 18:30:00', false);
```

---

#### 2.6 `quizzes` (Quiz metadata)

```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    duration_minutes INT NOT NULL, -- Quiz time limit
    total_marks INT NOT NULL,
    total_questions INT NOT NULL,
    scheduled_at TIMESTAMP,
    deadline TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_class_id ON quizzes(class_id);
CREATE INDEX idx_quizzes_scheduled_at ON quizzes(scheduled_at);
```

**Note**: Quiz questions are stored in **MongoDB** (see section below) for schema flexibility.

---

#### 2.7 `quiz_submissions` (Student quiz attempts)

```sql
CREATE TABLE quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- Array of {question_id, selected_option, is_correct}
    score INT NOT NULL,
    total_marks INT NOT NULL,
    percentage DECIMAL(5, 2),
    time_taken_minutes INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(quiz_id, student_id)
);

CREATE INDEX idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
CREATE INDEX idx_quiz_submissions_student_id ON quiz_submissions(student_id);
```

**Sample JSONB Structure:**
```json
[
  {
    "question_id": "q123",
    "selected_option": 2,
    "is_correct": true,
    "marks": 2
  },
  {
    "question_id": "q124",
    "selected_option": 0,
    "is_correct": false,
    "marks": 0
  }
]
```

---

#### 2.8 `grades` (Assessment marks)

```sql
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    assessment_type VARCHAR(50) NOT NULL, -- 'FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2'
    marks_obtained DECIMAL(5, 2) NOT NULL,
    total_marks DECIMAL(5, 2) NOT NULL,
    percentage DECIMAL(5, 2),
    grade VARCHAR(5), -- 'A+', 'A', 'B+', etc.
    remarks TEXT,
    exam_date DATE,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, subject_id, assessment_type, academic_year)
);

CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_class_id ON grades(class_id);
CREATE INDEX idx_grades_assessment_type ON grades(assessment_type);
```

**Sample Data:**
```sql
INSERT INTO grades (student_id, subject_id, class_id, assessment_type, marks_obtained, total_marks, percentage, grade, exam_date, academic_year) VALUES
('student-uuid-1', 'subject-uuid-1', 'class-uuid-1', 'FA1', 18, 20, 90, 'A+', '2025-07-15', '2025-2026'),
('student-uuid-1', 'subject-uuid-1', 'class-uuid-1', 'FA2', 16, 20, 80, 'A', '2025-09-15', '2025-2026');
```

---

#### 2.9 `attendance` (Daily attendance)

```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'excused')),
    reason TEXT,
    marked_by UUID REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
```

**Sample Data:**
```sql
INSERT INTO attendance (student_id, class_id, date, status, marked_by) VALUES
('student-uuid-1', 'class-uuid-1', '2025-11-20', 'present', 'teacher-uuid-1'),
('student-uuid-1', 'class-uuid-1', '2025-11-21', 'absent', 'teacher-uuid-1');
```

---

#### 2.10 `study_materials` (Learning resources)

```sql
CREATE TABLE study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    file_url TEXT NOT NULL, -- S3 URL
    file_type VARCHAR(50), -- 'pdf', 'pptx', 'video', 'doc'
    file_size_bytes BIGINT,
    downloads INT DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_materials_class_id ON study_materials(class_id);
CREATE INDEX idx_study_materials_subject_id ON study_materials(subject_id);
```

---

#### 2.11 `leaderboard` (Student rankings)

```sql
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    academic_year VARCHAR(20) NOT NULL,
    total_points INT DEFAULT 0,
    quiz_points INT DEFAULT 0,
    homework_points INT DEFAULT 0,
    attendance_points INT DEFAULT 0,
    rank INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, class_id, academic_year)
);

CREATE INDEX idx_leaderboard_class_id ON leaderboard(class_id);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
```

**Note**: Leaderboard is also cached in **Redis sorted sets** for real-time access.

---

### 3. Financial Tables

#### 3.1 `fee_structures` (Fee configuration)

```sql
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id),
    academic_year VARCHAR(20) NOT NULL,
    term VARCHAR(50), -- 'Term 1', 'Term 2', 'Annual'
    tuition_fee DECIMAL(10, 2) NOT NULL,
    transport_fee DECIMAL(10, 2) DEFAULT 0,
    lab_fee DECIMAL(10, 2) DEFAULT 0,
    exam_fee DECIMAL(10, 2) DEFAULT 0,
    library_fee DECIMAL(10, 2) DEFAULT 0,
    sports_fee DECIMAL(10, 2) DEFAULT 0,
    other_fees DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (
        tuition_fee + transport_fee + lab_fee + exam_fee + library_fee + sports_fee + other_fees
    ) STORED,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(class_id, academic_year, term)
);

CREATE INDEX idx_fee_structures_class_id ON fee_structures(class_id);
```

**Sample Data:**
```sql
INSERT INTO fee_structures (class_id, academic_year, term, tuition_fee, transport_fee, lab_fee, exam_fee, library_fee, due_date) VALUES
('class-uuid-1', '2025-2026', 'Term 1', 25000, 5000, 2000, 1500, 1000, '2025-07-30');
```

---

#### 3.2 `invoices` (Generated invoices)

```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id),
    amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount - discount + tax) STORED,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_student_id ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

**Sample Data:**
```sql
INSERT INTO invoices (invoice_number, student_id, fee_structure_id, amount, discount, tax, due_date, status) VALUES
('INV-2025-001', 'student-uuid-1', 'fee-struct-uuid-1', 34500, 500, 0, '2025-07-30', 'pending');
```

---

#### 3.3 `payments` (Payment records)

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE, -- From payment gateway
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'upi', 'card', 'cash', 'net_banking'
    payment_gateway VARCHAR(50), -- 'razorpay', 'stripe'
    status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
```

**Sample Data:**
```sql
INSERT INTO payments (invoice_id, transaction_id, amount, payment_method, payment_gateway, status, paid_at) VALUES
('invoice-uuid-1', 'pay_rzp_abc123xyz', 34000, 'upi', 'razorpay', 'success', '2025-07-25 14:30:00');
```

---

### 4. Operations Tables

#### 4.1 `bus_routes` (Transportation routes)

```sql
CREATE TABLE bus_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_number VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    driver_id UUID REFERENCES staff(id),
    vehicle_number VARCHAR(50),
    capacity INT,
    stops JSONB NOT NULL, -- Array of {stop_name, time, latitude, longitude}
    start_time TIME,
    end_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bus_routes_route_number ON bus_routes(route_number);
```

**Sample JSONB Structure:**
```json
[
  {
    "stop_name": "Main Gate",
    "time": "07:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "order": 1
  },
  {
    "stop_name": "Park Street",
    "time": "07:15",
    "latitude": 28.6200,
    "longitude": 77.2150,
    "order": 2
  }
]
```

---

#### 4.2 `route_students` (Student-route mapping)

```sql
CREATE TABLE route_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
    pickup_stop VARCHAR(255) NOT NULL,
    drop_stop VARCHAR(255) NOT NULL,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, route_id, academic_year)
);

CREATE INDEX idx_route_students_student_id ON route_students(student_id);
CREATE INDEX idx_route_students_route_id ON route_students(route_id);
```

---

#### 4.3 `inventory` (Asset management)

```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'lab_equipment', 'books', 'it_assets', 'furniture'
    sub_category VARCHAR(100),
    item_code VARCHAR(100) UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2),
    total_value DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    location VARCHAR(255), -- 'Lab-1', 'Library', 'Office'
    condition VARCHAR(50) DEFAULT 'good' CHECK (condition IN ('good', 'fair', 'damaged', 'obsolete')),
    purchase_date DATE,
    warranty_until DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_item_code ON inventory(item_code);
```

---

#### 4.4 `calendar_events` (School events)

```sql
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'exam', 'holiday', 'meeting', 'sports', 'cultural'
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    is_holiday BOOLEAN DEFAULT false,
    target_audience TEXT[], -- ['students', 'teachers', 'parents']
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX idx_calendar_events_event_type ON calendar_events(event_type);
```

---

### 5. Performance & Engagement Tables

#### 5.1 `student_usage` (Dashboard usage tracking)

```sql
CREATE TABLE student_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    login_time TIMESTAMP NOT NULL,
    logout_time TIMESTAMP,
    session_duration_minutes INT,
    pages_visited JSONB, -- {page: count}
    actions_performed JSONB, -- {action: count}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_usage_student_id ON student_usage(student_id);
CREATE INDEX idx_student_usage_login_time ON student_usage(login_time);
```

---

#### 5.2 `teacher_feedback` (Student feedback)

```sql
CREATE TABLE teacher_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    assessment_type VARCHAR(50), -- 'FA1', 'SA1', etc.
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    strengths TEXT,
    areas_for_improvement TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teacher_feedback_student_id ON teacher_feedback(student_id);
```

---

## 🍃 MongoDB Schema (Document Database)

### Connection Configuration

```yaml
Database: schools24_mongodb
Connection String: mongodb://localhost:27017 (dev) / MongoDB Atlas (prod)
Max Pool Size: 100
```

### Collection Schemas

#### 1. `questions` (Quiz question bank)

```javascript
{
  _id: ObjectId("..."),
  quiz_id: "uuid-from-postgres",
  subject_id: "uuid-from-postgres",
  topic: "Quadratic Equations",
  difficulty: "medium", // easy, medium, hard
  question_type: "mcq", // mcq, true_false, short_answer
  question_text: "Solve: 2x² + 5x - 3 = 0",
  options: [
    "x = 1, x = -3/2",
    "x = -1, x = 3/2",
    "x = 2, x = -3",
    "x = -2, x = 3"
  ],
  correct_answer: 0, // Index of correct option
  explanation: "Using quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
  marks: 2,
  tags: ["algebra", "equations", "quadratic"],
  created_by: "teacher-uuid",
  usage_count: 45,
  avg_score: 78.5,
  created_at: ISODate("2025-11-15T10:00:00Z"),
  updated_at: ISODate("2025-11-15T10:00:00Z")
}
```

**Indexes:**
```javascript
db.questions.createIndex({ quiz_id: 1 });
db.questions.createIndex({ subject_id: 1, difficulty: 1 });
db.questions.createIndex({ tags: 1 });
db.questions.createIndex({ "question_text": "text" }); // Full-text search
```

---

#### 2. `quiz_analytics` (Detailed quiz performance)

```javascript
{
  _id: ObjectId("..."),
  quiz_id: "uuid-from-postgres",
  student_id: "uuid-from-postgres",
  class_id: "uuid-from-postgres",
  total_questions: 20,
  correct_answers: 16,
  wrong_answers: 4,
  unanswered: 0,
  score: 32,
  total_marks: 40,
  percentage: 80,
  time_taken_seconds: 1200,
  question_wise_analysis: [
    {
      question_id: ObjectId("..."),
      question_text: "Solve: 2x + 5 = 15",
      selected_option: 0,
      correct_option: 0,
      is_correct: true,
      time_spent_seconds: 45,
      marks_obtained: 2
    },
    // ... more questions
  ],
  topic_wise_performance: [
    {
      topic: "Algebra",
      total_questions: 10,
      correct: 8,
      accuracy: 80
    },
    {
      topic: "Geometry",
      total_questions: 10,
      correct: 8,
      accuracy: 80
    }
  ],
  submitted_at: ISODate("2025-11-20T14:30:00Z")
}
```

**Indexes:**
```javascript
db.quiz_analytics.createIndex({ quiz_id: 1, student_id: 1 }, { unique: true });
db.quiz_analytics.createIndex({ class_id: 1, submitted_at: -1 });
```

---

#### 3. `activity_logs` (User activity tracking)

```javascript
{
  _id: ObjectId("..."),
  user_id: "uuid-from-postgres",
  user_role: "student",
  action: "homework_submission",
  entity_type: "homework",
  entity_id: "homework-uuid",
  details: {
    homework_title: "Chapter 5 Homework",
    submission_file: "s3://...",
    submission_time: "2025-11-24T18:30:00Z"
  },
  ip_address: "192.168.1.100",
  user_agent: "Mozilla/5.0...",
  timestamp: ISODate("2025-11-24T18:30:00Z")
}
```

**Indexes:**
```javascript
db.activity_logs.createIndex({ user_id: 1, timestamp: -1 });
db.activity_logs.createIndex({ action: 1, timestamp: -1 });
db.activity_logs.createIndex({ timestamp: -1 }); // TTL index (auto-delete after 90 days)
```

---

#### 4. `notification_archive` (Historical notifications)

```javascript
{
  _id: ObjectId("..."),
  recipient_id: "uuid-from-postgres",
  recipient_type: "student", // student, teacher, parent
  notification_type: "homework_assigned",
  title: "New Homework: Chapter 5",
  message: "Quadratic equations homework assigned. Due: Nov 25",
  channels: ["push", "email"], // Sent via which channels
  delivery_status: {
    push: { sent: true, delivered: true, failed: false },
    email: { sent: true, delivered: true, failed: false },
    sms: { sent: false }
  },
  entity_reference: {
    type: "homework",
    id: "homework-uuid"
  },
  read_at: ISODate("2025-11-21T10:00:00Z"),
  created_at: ISODate("2025-11-20T17:00:00Z")
}
```

**Indexes:**
```javascript
db.notification_archive.createIndex({ recipient_id: 1, created_at: -1 });
db.notification_archive.createIndex({ notification_type: 1 });
```

---

#### 5. `report_templates` (Custom report configurations)

```javascript
{
  _id: ObjectId("..."),
  template_name: "Student Progress Report",
  template_type: "academic",
  created_by: "admin-uuid",
  filters: {
    date_range: { start: "2025-07-01", end: "2025-11-30" },
    classes: ["class-uuid-1", "class-uuid-2"],
    subjects: ["subject-uuid-1", "subject-uuid-2"]
  },
  columns: [
    { name: "Student Name", field: "full_name" },
    { name: "Roll Number", field: "roll_number" },
    { name: "FA1 Marks", field: "fa1_marks" },
    { name: "FA2 Marks", field: "fa2_marks" },
    { name: "Attendance %", field: "attendance_percentage" }
  ],
  chart_config: {
    type: "bar",
    x_axis: "subjects",
    y_axis: "avg_marks"
  },
  is_public: false,
  created_at: ISODate("2025-11-01T10:00:00Z"),
  updated_at: ISODate("2025-11-15T14:30:00Z")
}
```

---

## 🔴 Redis Schema (Cache & Session Store)

### Connection Configuration

```yaml
Host: localhost (dev) / ElastiCache endpoint (prod)
Port: 6379
Database: 0
Max Connections: 100
Password: (set in production)
```

### Key Naming Conventions

```
sessions:{token}                          # User session data (24h TTL)
user:profile:{user_id}                    # User profile cache (1h TTL)
dashboard:student:{student_id}            # Student dashboard data (30min TTL)
dashboard:teacher:{teacher_id}            # Teacher dashboard data (30min TTL)
leaderboard:class:{class_id}              # Sorted set for rankings (updated real-time)
write_buffer:homework:{homework_id}       # Compressed homework data (2h TTL)
write_buffer:quiz_submission:{sub_id}     # Compressed quiz submission (2h TTL)
write_buffer:attendance:{date}:{class}    # Compressed attendance data (2h TTL)
write_buffer:payment:{payment_id}         # Compressed payment data (2h TTL)
meta:write_buffer:{entity}:{id}           # Metadata hash (compression info, sync status)
calendar:events:{month}                   # Monthly event cache (12h TTL)
inventory:items:available                 # Available inventory cache (1h TTL)
rate_limit:api:{user_id}                  # API rate limiting counter (1min TTL)
```

### Data Structure Examples

#### 1. Session Storage (String)

```redis
SET "sessions:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." '{
  "user_id": "uuid",
  "email": "student1@schools24.com",
  "role": "student",
  "name": "Rahul Kumar",
  "class_id": "class-uuid-1"
}' EX 86400
```

---

#### 2. Leaderboard (Sorted Set)

```redis
ZADD leaderboard:class:class-uuid-1 
  450 student-uuid-1 
  380 student-uuid-2 
  420 student-uuid-3
  
# Get top 10
ZREVRANGE leaderboard:class:class-uuid-1 0 9 WITHSCORES

# Get student rank
ZREVRANK leaderboard:class:class-uuid-1 student-uuid-1
```

---

#### 3. Write Buffer (Compressed String + Metadata Hash)

```redis
# Compressed homework data
SET "write_buffer:homework:hw-uuid-1" "<snappy-compressed-binary-data>" EX 7200

# Metadata
HMSET "meta:write_buffer:homework:hw-uuid-1"
  compressed true
  original_size 487
  compressed_size 134
  timestamp 1700000000
  synced_to_db false
  entity_type homework
```

---

#### 4. Dashboard Cache (Hash)

```redis
HMSET "dashboard:student:student-uuid-1"
  total_quizzes 12
  completed_quizzes 8
  avg_quiz_score 78.5
  total_homework 15
  submitted_homework 13
  attendance_percentage 92.5
  rank 3
  total_students 35
  
EXPIRE "dashboard:student:student-uuid-1" 1800  # 30 min TTL
```

---

#### 5. Rate Limiting (Counter)

```redis
INCR "rate_limit:api:user-uuid-1"
EXPIRE "rate_limit:api:user-uuid-1" 60

# Check if limit exceeded
GET "rate_limit:api:user-uuid-1"  # If > 100, return 429 Too Many Requests
```

---

## 🔐 Database Security & Best Practices

### PostgreSQL Security

```sql
-- Create application user with limited permissions
CREATE USER schools24_app WITH PASSWORD 'strong_password_here';

-- Grant specific permissions (not superuser)
GRANT CONNECT ON DATABASE schools24_db TO schools24_app;
GRANT USAGE ON SCHEMA public TO schools24_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO schools24_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO schools24_app;

-- Enable row-level security (future enhancement)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
```

---

### MongoDB Security

```javascript
// Create database user
use admin;
db.createUser({
  user: "schools24_app",
  pwd: "strong_password_here",
  roles: [
    { role: "readWrite", db: "schools24_mongodb" }
  ]
});

// Enable authentication in mongod.conf
security:
  authorization: enabled
```

---

### Redis Security

```bash
# redis.conf
requirepass strong_redis_password_here
maxmemory 4gb
maxmemory-policy allkeys-lru  # Evict least recently used keys when memory full
dir /var/lib/redis
dbfilename dump.rdb
save 900 1      # Save if 1 key changed in 15 minutes
save 300 10     # Save if 10 keys changed in 5 minutes
```

---

## 📊 Database Sizing Estimates

### PostgreSQL Storage (1000 students, 50 teachers, 3-year data retention)

| Table | Rows | Avg Row Size | Total Size |
|-------|------|--------------|------------|
| users | 1,100 | 500 bytes | 550 KB |
| students | 1,000 | 800 bytes | 800 KB |
| teachers | 50 | 600 bytes | 30 KB |
| attendance | 180,000 | 200 bytes | 36 MB |
| grades | 60,000 | 300 bytes | 18 MB |
| homework | 1,500 | 500 bytes | 750 KB |
| homework_submissions | 30,000 | 400 bytes | 12 MB |
| quizzes | 500 | 400 bytes | 200 KB |
| quiz_submissions | 10,000 | 800 bytes | 8 MB |
| invoices | 12,000 | 300 bytes | 3.6 MB |
| payments | 10,000 | 400 bytes | 4 MB |
| Other tables | - | - | ~20 MB |

**Total PostgreSQL**: ~100 GB (with indexes, WAL logs, backups)

---

### MongoDB Storage

| Collection | Documents | Avg Doc Size | Total Size |
|------------|-----------|--------------|------------|
| questions | 10,000 | 1 KB | 10 MB |
| quiz_analytics | 10,000 | 5 KB | 50 MB |
| activity_logs | 500,000 | 0.5 KB | 250 MB |
| notification_archive | 100,000 | 1 KB | 100 MB |
| report_templates | 50 | 2 KB | 100 KB |

**Total MongoDB**: ~500 MB

---

### Redis Memory

| Key Pattern | Count | Avg Size | Total |
|-------------|-------|----------|-------|
| sessions | 200 | 500 bytes | 100 KB |
| write_buffer | 5,000 | 150 bytes (compressed) | 750 KB |
| leaderboard | 100 | 10 KB | 1 MB |
| dashboard cache | 500 | 2 KB | 1 MB |
| Other keys | - | - | ~500 KB |

**Total Redis**: 2-4 GB (with overhead)

---

## 🚀 Next Steps

1. **Create migration files** (see `migrations/` folder)
2. **Set up database connections** in Go backend
3. **Implement GORM models** for PostgreSQL tables
4. **Implement MongoDB collections** with Go driver
5. **Configure Redis caching layer**
6. **Run initial seed data** for testing

**Companion Files:**
- `KUBERNETES_ARCHITECTURE.md` - K8s deployment strategy
- `BACKEND_API_DESIGN.md` - Complete API specification
- `migrations/001_initial_schema.sql` - PostgreSQL migrations

---

**Schema Version**: 1.0.0  
**Last Updated**: 2025-11-27  
**Database Compatibility**: PostgreSQL 16+, MongoDB 7.0+, Redis 7.2+
