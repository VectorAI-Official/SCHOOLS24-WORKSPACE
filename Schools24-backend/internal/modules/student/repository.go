package student

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/schools24/backend/internal/shared/database"
)

// Repository handles database operations for students
type Repository struct {
	db *database.PostgresDB
}

// NewRepository creates a new student repository
func NewRepository(db *database.PostgresDB) *Repository {
	return &Repository{db: db}
}

// GetStudentByUserID retrieves a student profile by user ID
func (r *Repository) GetStudentByUserID(ctx context.Context, userID uuid.UUID) (*Student, error) {
	query := `
		SELECT s.id, s.user_id, s.admission_number, s.roll_number, s.class_id, s.section,
		       s.date_of_birth, s.gender, s.blood_group, s.address, s.parent_name,
		       s.parent_email, s.parent_phone, s.emergency_contact, s.admission_date,
		       s.academic_year, s.created_at, s.updated_at,
		       u.full_name, u.email, COALESCE(c.name, '') as class_name
		FROM students s
		JOIN users u ON s.user_id = u.id
		LEFT JOIN classes c ON s.class_id = c.id
		WHERE s.user_id = $1
	`

	var student Student
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&student.ID, &student.UserID, &student.AdmissionNumber, &student.RollNumber,
		&student.ClassID, &student.Section, &student.DateOfBirth, &student.Gender,
		&student.BloodGroup, &student.Address, &student.ParentName, &student.ParentEmail,
		&student.ParentPhone, &student.EmergencyContact, &student.AdmissionDate,
		&student.AcademicYear, &student.CreatedAt, &student.UpdatedAt,
		&student.FullName, &student.Email, &student.ClassName,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get student: %w", err)
	}

	return &student, nil
}

// CreateStudent creates a new student profile
func (r *Repository) CreateStudent(ctx context.Context, student *Student) error {
	query := `
		INSERT INTO students (id, user_id, admission_number, roll_number, class_id, section,
		                      date_of_birth, gender, blood_group, address, parent_name,
		                      parent_email, parent_phone, emergency_contact, admission_date,
		                      academic_year, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
		RETURNING id, created_at, updated_at
	`

	now := time.Now()
	student.ID = uuid.New()
	student.AdmissionDate = now
	student.CreatedAt = now
	student.UpdatedAt = now

	return r.db.QueryRow(ctx, query,
		student.ID, student.UserID, student.AdmissionNumber, student.RollNumber,
		student.ClassID, student.Section, student.DateOfBirth, student.Gender,
		student.BloodGroup, student.Address, student.ParentName, student.ParentEmail,
		student.ParentPhone, student.EmergencyContact, student.AdmissionDate,
		student.AcademicYear, student.CreatedAt, student.UpdatedAt,
	).Scan(&student.ID, &student.CreatedAt, &student.UpdatedAt)
}

// GetClassByID retrieves a class by ID
func (r *Repository) GetClassByID(ctx context.Context, classID uuid.UUID) (*Class, error) {
	query := `
		SELECT c.id, c.name, c.grade, c.section, c.class_teacher_id, c.academic_year,
		       c.total_students, c.room_number, c.created_at, c.updated_at,
		       COALESCE(u.full_name, '') as class_teacher_name
		FROM classes c
		LEFT JOIN teachers t ON c.class_teacher_id = t.id
		LEFT JOIN users u ON t.user_id = u.id
		WHERE c.id = $1
	`

	var class Class
	err := r.db.QueryRow(ctx, query, classID).Scan(
		&class.ID, &class.Name, &class.Grade, &class.Section, &class.ClassTeacherID,
		&class.AcademicYear, &class.TotalStudents, &class.RoomNumber,
		&class.CreatedAt, &class.UpdatedAt, &class.ClassTeacherName,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get class: %w", err)
	}

	return &class, nil
}

// GetAllClasses retrieves all classes
func (r *Repository) GetAllClasses(ctx context.Context, academicYear string) ([]Class, error) {
	query := `
		SELECT c.id, c.name, c.grade, c.section, c.class_teacher_id, c.academic_year,
		       c.total_students, c.room_number, c.created_at, c.updated_at,
		       COALESCE(u.full_name, '') as class_teacher_name
		FROM classes c
		LEFT JOIN teachers t ON c.class_teacher_id = t.id
		LEFT JOIN users u ON t.user_id = u.id
		WHERE c.academic_year = $1
		ORDER BY c.grade, c.section
	`

	rows, err := r.db.Query(ctx, query, academicYear)
	if err != nil {
		return nil, fmt.Errorf("failed to get classes: %w", err)
	}
	defer rows.Close()

	var classes []Class
	for rows.Next() {
		var class Class
		err := rows.Scan(
			&class.ID, &class.Name, &class.Grade, &class.Section, &class.ClassTeacherID,
			&class.AcademicYear, &class.TotalStudents, &class.RoomNumber,
			&class.CreatedAt, &class.UpdatedAt, &class.ClassTeacherName,
		)
		if err != nil {
			return nil, err
		}
		classes = append(classes, class)
	}

	return classes, nil
}

// GetAttendanceStats gets attendance statistics for a student
func (r *Repository) GetAttendanceStats(ctx context.Context, studentID uuid.UUID, startDate, endDate time.Time) (*AttendanceStats, error) {
	query := `
		SELECT 
			COUNT(*) as total_days,
			COUNT(*) FILTER (WHERE status = 'present') as present_days,
			COUNT(*) FILTER (WHERE status = 'absent') as absent_days,
			COUNT(*) FILTER (WHERE status = 'late') as late_days
		FROM attendance
		WHERE student_id = $1 AND date BETWEEN $2 AND $3
	`

	var stats AttendanceStats
	err := r.db.QueryRow(ctx, query, studentID, startDate, endDate).Scan(
		&stats.TotalDays, &stats.PresentDays, &stats.AbsentDays, &stats.LateDays,
	)
	if err != nil {
		return nil, err
	}

	if stats.TotalDays > 0 {
		stats.AttendancePercent = float64(stats.PresentDays) / float64(stats.TotalDays) * 100
	}

	return &stats, nil
}

// GetRecentAttendance gets recent attendance records for a student
func (r *Repository) GetRecentAttendance(ctx context.Context, studentID uuid.UUID, limit int) ([]Attendance, error) {
	query := `
		SELECT id, student_id, class_id, date, status, marked_by, remarks, created_at
		FROM attendance
		WHERE student_id = $1
		ORDER BY date DESC
		LIMIT $2
	`

	rows, err := r.db.Query(ctx, query, studentID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []Attendance
	for rows.Next() {
		var a Attendance
		err := rows.Scan(&a.ID, &a.StudentID, &a.ClassID, &a.Date, &a.Status, &a.MarkedBy, &a.Remarks, &a.CreatedAt)
		if err != nil {
			return nil, err
		}
		records = append(records, a)
	}

	return records, nil
}

// CreateClass creates a new class
func (r *Repository) CreateClass(ctx context.Context, class *Class) error {
	query := `
		INSERT INTO classes (id, name, grade, section, academic_year, total_students, room_number, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`

	now := time.Now()
	class.ID = uuid.New()
	class.CreatedAt = now
	class.UpdatedAt = now

	return r.db.QueryRow(ctx, query,
		class.ID, class.Name, class.Grade, class.Section, class.AcademicYear,
		class.TotalStudents, class.RoomNumber, class.CreatedAt, class.UpdatedAt,
	).Scan(&class.ID)
}
