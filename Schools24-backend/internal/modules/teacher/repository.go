package teacher

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/schools24/backend/internal/shared/database"
)

// Repository handles database operations for teacher module
type Repository struct {
	db *database.PostgresDB
}

// NewRepository creates a new teacher repository
func NewRepository(db *database.PostgresDB) *Repository {
	return &Repository{db: db}
}

// GetTeacherByUserID retrieves a teacher by their user ID
func (r *Repository) GetTeacherByUserID(ctx context.Context, userID uuid.UUID) (*Teacher, error) {
	query := `
		SELECT t.id, t.user_id, t.employee_id, t.department, t.designation,
		       t.qualifications, t.joining_date, t.subjects_taught, t.experience_years,
		       t.is_active, t.created_at, t.updated_at,
		       u.full_name, u.email, u.phone, u.avatar
		FROM teachers t
		JOIN users u ON t.user_id = u.id
		WHERE t.user_id = $1 AND t.is_active = true
	`

	var t Teacher
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&t.ID, &t.UserID, &t.EmployeeID, &t.Department, &t.Designation,
		&t.Qualifications, &t.JoiningDate, &t.SubjectsTaught, &t.Experience,
		&t.IsActive, &t.CreatedAt, &t.UpdatedAt,
		&t.FullName, &t.Email, &t.Phone, &t.Avatar,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}

// GetTeacherAssignments retrieves classes assigned to a teacher
func (r *Repository) GetTeacherAssignments(ctx context.Context, teacherID uuid.UUID, academicYear string) ([]TeacherAssignment, error) {
	query := `
		SELECT ta.id, ta.teacher_id, ta.class_id, ta.subject_id, ta.is_class_teacher,
		       ta.academic_year, ta.created_at, ta.updated_at,
		       c.name as class_name, COALESCE(s.name, '') as subject_name
		FROM teacher_assignments ta
		JOIN classes c ON ta.class_id = c.id
		LEFT JOIN subjects s ON ta.subject_id = s.id
		WHERE ta.teacher_id = $1 AND ta.academic_year = $2
		ORDER BY c.grade, c.section
	`

	rows, err := r.db.Query(ctx, query, teacherID, academicYear)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assignments []TeacherAssignment
	for rows.Next() {
		var a TeacherAssignment
		err := rows.Scan(
			&a.ID, &a.TeacherID, &a.ClassID, &a.SubjectID, &a.IsClassTeacher,
			&a.AcademicYear, &a.CreatedAt, &a.UpdatedAt,
			&a.ClassName, &a.SubjectName,
		)
		if err != nil {
			return nil, err
		}
		assignments = append(assignments, a)
	}
	return assignments, nil
}

// GetTodaySchedule retrieves teacher's schedule for today
func (r *Repository) GetTodaySchedule(ctx context.Context, teacherID uuid.UUID, dayOfWeek int, academicYear string) ([]TodayPeriod, error) {
	query := `
		SELECT t.period_number, t.start_time::text, t.end_time::text,
		       c.name as class_name, COALESCE(s.name, '') as subject_name,
		       COALESCE(t.room_number, '') as room_number
		FROM timetables t
		JOIN classes c ON t.class_id = c.id
		LEFT JOIN subjects s ON t.subject_id = s.id
		WHERE t.teacher_id = $1 AND t.day_of_week = $2 AND t.academic_year = $3
		ORDER BY t.period_number
	`

	rows, err := r.db.Query(ctx, query, teacherID, dayOfWeek, academicYear)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var periods []TodayPeriod
	for rows.Next() {
		var p TodayPeriod
		err := rows.Scan(&p.PeriodNumber, &p.StartTime, &p.EndTime, &p.ClassName, &p.SubjectName, &p.RoomNumber)
		if err != nil {
			return nil, err
		}
		periods = append(periods, p)
	}
	return periods, nil
}

// GetStudentCountByClasses gets total students for teacher's classes
func (r *Repository) GetStudentCountByClasses(ctx context.Context, teacherID uuid.UUID, academicYear string) (int, error) {
	query := `
		SELECT COUNT(DISTINCT s.id)
		FROM students s
		JOIN teacher_assignments ta ON s.class_id = ta.class_id
		WHERE ta.teacher_id = $1 AND ta.academic_year = $2 AND s.is_active = true
	`

	var count int
	err := r.db.QueryRow(ctx, query, teacherID, academicYear).Scan(&count)
	return count, err
}

// GetPendingHomeworkCount gets count of homework pending grading
func (r *Repository) GetPendingHomeworkCount(ctx context.Context, teacherID uuid.UUID) (int, error) {
	query := `
		SELECT COUNT(hs.id)
		FROM homework_submissions hs
		JOIN homework h ON hs.homework_id = h.id
		WHERE h.teacher_id = $1 AND hs.status = 'submitted'
	`

	var count int
	err := r.db.QueryRow(ctx, query, teacherID).Scan(&count)
	return count, err
}

// MarkAttendance marks attendance for a class
func (r *Repository) MarkAttendance(ctx context.Context, teacherID uuid.UUID, classID uuid.UUID, date time.Time, records []StudentAttendance, photoURL string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// 1. Create/Update Attendance Session (Photo proof)
	if photoURL != "" {
		sessionQuery := `
			INSERT INTO attendance_sessions (class_id, teacher_id, date, photo_url, created_at)
			VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
			ON CONFLICT (class_id, date) 
			DO UPDATE SET photo_url = EXCLUDED.photo_url, teacher_id = EXCLUDED.teacher_id
		`
		if _, err := tx.Exec(ctx, sessionQuery, classID, teacherID, date, photoURL); err != nil {
			return err
		}
	}

	// 2. Insert/Update individual Student Records
	query := `
		INSERT INTO attendance (student_id, class_id, date, status, remarks, marked_by)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (student_id, date) 
		DO UPDATE SET status = EXCLUDED.status, remarks = EXCLUDED.remarks, marked_by = EXCLUDED.marked_by
	`
	for _, record := range records {
		studentID, err := uuid.Parse(record.StudentID)
		if err != nil {
			continue // Skip invalid uuid
		}
		if _, err := tx.Exec(ctx, query, studentID, classID, date, record.Status, record.Remarks, teacherID); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// CreateHomework creates a new homework assignment
func (r *Repository) CreateHomework(ctx context.Context, teacherID uuid.UUID, hw *CreateHomeworkRequest) (uuid.UUID, error) {
	classID, _ := uuid.Parse(hw.ClassID)
	var subjectID *uuid.UUID
	if hw.SubjectID != "" {
		id, _ := uuid.Parse(hw.SubjectID)
		subjectID = &id
	}

	dueDate, err := time.Parse(time.RFC3339, hw.DueDate)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid due date format")
	}

	query := `
		INSERT INTO homework (title, description, class_id, subject_id, teacher_id, due_date, max_marks, attachments, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
		RETURNING id
	`

	maxMarks := hw.MaxMarks
	if maxMarks == 0 {
		maxMarks = 100
	}

	var id uuid.UUID
	err = r.db.QueryRow(ctx, query,
		hw.Title, hw.Description, classID, subjectID, teacherID,
		dueDate, maxMarks, hw.Attachments,
	).Scan(&id)

	return id, err
}

// EnterGrade enters a grade for a student
func (r *Repository) EnterGrade(ctx context.Context, teacherID uuid.UUID, req *EnterGradeRequest) error {
	studentID, _ := uuid.Parse(req.StudentID)
	var subjectID *uuid.UUID
	if req.SubjectID != "" {
		id, _ := uuid.Parse(req.SubjectID)
		subjectID = &id
	}

	var examDate *time.Time
	if req.ExamDate != "" {
		t, _ := time.Parse("2006-01-02", req.ExamDate)
		examDate = &t
	}

	academicYear := getCurrentAcademicYear()

	query := `
		INSERT INTO grades (student_id, subject_id, exam_type, exam_name, max_marks, marks_obtained, remarks, graded_by, exam_date, academic_year)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`

	return r.db.Exec(ctx, query,
		studentID, subjectID, req.ExamType, req.ExamName,
		req.MaxMarks, req.MarksObtained, req.Remarks, teacherID, examDate, academicYear,
	)
}

// GetStudentsByClass retrieves students in a class
func (r *Repository) GetStudentsByClass(ctx context.Context, classID uuid.UUID) ([]StudentInfo, error) {
	query := `
		SELECT s.id, s.user_id, s.roll_number, u.full_name, u.email
		FROM students s
		JOIN users u ON s.user_id = u.id
		WHERE s.class_id = $1 AND s.is_active = true
		ORDER BY s.roll_number
	`

	rows, err := r.db.Query(ctx, query, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []StudentInfo
	for rows.Next() {
		var s StudentInfo
		err := rows.Scan(&s.ID, &s.UserID, &s.RollNumber, &s.FullName, &s.Email)
		if err != nil {
			return nil, err
		}
		students = append(students, s)
	}
	return students, nil
}

// CreateAnnouncement creates a new announcement
func (r *Repository) CreateAnnouncement(ctx context.Context, authorID uuid.UUID, req *CreateAnnouncementRequest) (uuid.UUID, error) {
	var targetID *uuid.UUID
	if req.TargetID != "" {
		id, _ := uuid.Parse(req.TargetID)
		targetID = &id
	}

	priority := req.Priority
	if priority == "" {
		priority = "normal"
	}

	var expiresAt *time.Time
	if req.ExpiresAt != "" {
		t, _ := time.Parse(time.RFC3339, req.ExpiresAt)
		expiresAt = &t
	}

	query := `
		INSERT INTO announcements (title, content, author_id, target_type, target_id, priority, is_pinned, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	var id uuid.UUID
	err := r.db.QueryRow(ctx, query,
		req.Title, req.Content, authorID, req.TargetType, targetID, priority, req.IsPinned, expiresAt,
	).Scan(&id)

	return id, err
}

// GetRecentAnnouncements gets recent announcements
func (r *Repository) GetRecentAnnouncements(ctx context.Context, limit int) ([]Announcement, error) {
	query := `
		SELECT a.id, a.title, a.content, a.author_id, a.target_type, a.target_id,
		       a.priority, a.is_pinned, a.expires_at, a.created_at, a.updated_at,
		       u.full_name as author_name
		FROM announcements a
		JOIN users u ON a.author_id = u.id
		WHERE (a.expires_at IS NULL OR a.expires_at > CURRENT_TIMESTAMP)
		ORDER BY a.is_pinned DESC, a.created_at DESC
		LIMIT $1
	`

	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var announcements []Announcement
	for rows.Next() {
		var a Announcement
		err := rows.Scan(
			&a.ID, &a.Title, &a.Content, &a.AuthorID, &a.TargetType, &a.TargetID,
			&a.Priority, &a.IsPinned, &a.ExpiresAt, &a.CreatedAt, &a.UpdatedAt,
			&a.AuthorName,
		)
		if err != nil {
			return nil, err
		}
		announcements = append(announcements, a)
	}
	return announcements, nil
}

// StudentInfo for listing students
type StudentInfo struct {
	ID         uuid.UUID `json:"id"`
	UserID     uuid.UUID `json:"user_id"`
	RollNumber string    `json:"roll_number"`
	FullName   string    `json:"full_name"`
	Email      string    `json:"email"`
}

// Helper function
func getCurrentAcademicYear() string {
	now := time.Now()
	year := now.Year()
	month := now.Month()

	if month < time.April {
		return fmt.Sprintf("%d-%d", year-1, year)
	}
	return fmt.Sprintf("%d-%d", year, year+1)
}
