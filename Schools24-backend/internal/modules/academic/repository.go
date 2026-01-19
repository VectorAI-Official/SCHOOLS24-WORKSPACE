package academic

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/schools24/backend/internal/shared/database"
)

// Repository handles database operations for academic module
type Repository struct {
	db *database.PostgresDB
}

// NewRepository creates a new academic repository
func NewRepository(db *database.PostgresDB) *Repository {
	return &Repository{db: db}
}

// GetTimetableByClassID retrieves timetable for a class
func (r *Repository) GetTimetableByClassID(ctx context.Context, classID uuid.UUID, academicYear string) ([]Timetable, error) {
	query := `
		SELECT t.id, t.class_id, t.day_of_week, t.period_number, t.subject_id, t.teacher_id,
		       t.start_time::text, t.end_time::text, t.room_number, t.academic_year,
		       t.created_at, t.updated_at,
		       COALESCE(s.name, '') as subject_name,
		       COALESCE(u.full_name, '') as teacher_name,
		       COALESCE(c.name, '') as class_name
		FROM timetables t
		LEFT JOIN subjects s ON t.subject_id = s.id
		LEFT JOIN teachers te ON t.teacher_id = te.id
		LEFT JOIN users u ON te.user_id = u.id
		LEFT JOIN classes c ON t.class_id = c.id
		WHERE t.class_id = $1 AND t.academic_year = $2
		ORDER BY t.day_of_week, t.period_number
	`

	rows, err := r.db.Query(ctx, query, classID, academicYear)
	if err != nil {
		return nil, fmt.Errorf("failed to get timetable: %w", err)
	}
	defer rows.Close()

	var timetables []Timetable
	for rows.Next() {
		var t Timetable
		err := rows.Scan(
			&t.ID, &t.ClassID, &t.DayOfWeek, &t.PeriodNumber, &t.SubjectID, &t.TeacherID,
			&t.StartTime, &t.EndTime, &t.RoomNumber, &t.AcademicYear,
			&t.CreatedAt, &t.UpdatedAt,
			&t.SubjectName, &t.TeacherName, &t.ClassName,
		)
		if err != nil {
			return nil, err
		}
		timetables = append(timetables, t)
	}

	return timetables, nil
}

// CreateTimetableEntry creates a new timetable entry
func (r *Repository) CreateTimetableEntry(ctx context.Context, entry *Timetable) error {
	query := `
		INSERT INTO timetables (id, class_id, day_of_week, period_number, subject_id, teacher_id,
		                        start_time, end_time, room_number, academic_year, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7::time, $8::time, $9, $10, $11, $12)
		RETURNING id
	`

	now := time.Now()
	entry.ID = uuid.New()
	entry.CreatedAt = now
	entry.UpdatedAt = now

	return r.db.QueryRow(ctx, query,
		entry.ID, entry.ClassID, entry.DayOfWeek, entry.PeriodNumber,
		entry.SubjectID, entry.TeacherID, entry.StartTime, entry.EndTime,
		entry.RoomNumber, entry.AcademicYear, entry.CreatedAt, entry.UpdatedAt,
	).Scan(&entry.ID)
}

// GetHomeworkByClassID retrieves homework for a class
func (r *Repository) GetHomeworkByClassID(ctx context.Context, classID uuid.UUID, status string) ([]Homework, error) {
	query := `
		SELECT h.id, h.title, h.description, h.class_id, h.subject_id, h.teacher_id,
		       h.due_date, h.max_marks, h.attachments, h.status, h.created_at, h.updated_at,
		       COALESCE(s.name, '') as subject_name,
		       COALESCE(u.full_name, '') as teacher_name,
		       COALESCE(c.name, '') as class_name
		FROM homework h
		LEFT JOIN subjects s ON h.subject_id = s.id
		LEFT JOIN teachers te ON h.teacher_id = te.id
		LEFT JOIN users u ON te.user_id = u.id
		LEFT JOIN classes c ON h.class_id = c.id
		WHERE h.class_id = $1 AND h.status = $2
		ORDER BY h.due_date DESC
	`

	rows, err := r.db.Query(ctx, query, classID, status)
	if err != nil {
		return nil, fmt.Errorf("failed to get homework: %w", err)
	}
	defer rows.Close()

	var homeworks []Homework
	for rows.Next() {
		var h Homework
		err := rows.Scan(
			&h.ID, &h.Title, &h.Description, &h.ClassID, &h.SubjectID, &h.TeacherID,
			&h.DueDate, &h.MaxMarks, &h.Attachments, &h.Status, &h.CreatedAt, &h.UpdatedAt,
			&h.SubjectName, &h.TeacherName, &h.ClassName,
		)
		if err != nil {
			return nil, err
		}
		homeworks = append(homeworks, h)
	}

	return homeworks, nil
}

// CreateHomework creates a new homework assignment
func (r *Repository) CreateHomework(ctx context.Context, hw *Homework) error {
	query := `
		INSERT INTO homework (id, title, description, class_id, subject_id, teacher_id,
		                      due_date, max_marks, attachments, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
	`

	now := time.Now()
	hw.ID = uuid.New()
	hw.Status = "active"
	hw.CreatedAt = now
	hw.UpdatedAt = now

	return r.db.QueryRow(ctx, query,
		hw.ID, hw.Title, hw.Description, hw.ClassID, hw.SubjectID, hw.TeacherID,
		hw.DueDate, hw.MaxMarks, hw.Attachments, hw.Status, hw.CreatedAt, hw.UpdatedAt,
	).Scan(&hw.ID)
}

// GetHomeworkByID retrieves a single homework by ID
func (r *Repository) GetHomeworkByID(ctx context.Context, homeworkID uuid.UUID) (*Homework, error) {
	query := `
		SELECT h.id, h.title, h.description, h.class_id, h.subject_id, h.teacher_id,
		       h.due_date, h.max_marks, h.attachments, h.status, h.created_at, h.updated_at,
		       COALESCE(s.name, '') as subject_name,
		       COALESCE(u.full_name, '') as teacher_name,
		       COALESCE(c.name, '') as class_name
		FROM homework h
		LEFT JOIN subjects s ON h.subject_id = s.id
		LEFT JOIN teachers te ON h.teacher_id = te.id
		LEFT JOIN users u ON te.user_id = u.id
		LEFT JOIN classes c ON h.class_id = c.id
		WHERE h.id = $1
	`

	var h Homework
	err := r.db.QueryRow(ctx, query, homeworkID).Scan(
		&h.ID, &h.Title, &h.Description, &h.ClassID, &h.SubjectID, &h.TeacherID,
		&h.DueDate, &h.MaxMarks, &h.Attachments, &h.Status, &h.CreatedAt, &h.UpdatedAt,
		&h.SubjectName, &h.TeacherName, &h.ClassName,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &h, nil
}

// SubmitHomework creates a homework submission
func (r *Repository) SubmitHomework(ctx context.Context, sub *HomeworkSubmission) error {
	query := `
		INSERT INTO homework_submissions (id, homework_id, student_id, submission_text, attachments, submitted_at, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (homework_id, student_id) DO UPDATE
		SET submission_text = EXCLUDED.submission_text,
		    attachments = EXCLUDED.attachments,
		    submitted_at = EXCLUDED.submitted_at,
		    status = EXCLUDED.status
		RETURNING id
	`

	sub.ID = uuid.New()
	sub.SubmittedAt = time.Now()
	sub.Status = "submitted"

	return r.db.QueryRow(ctx, query,
		sub.ID, sub.HomeworkID, sub.StudentID, sub.SubmissionText,
		sub.Attachments, sub.SubmittedAt, sub.Status,
	).Scan(&sub.ID)
}

// GetStudentGrades retrieves grades for a student
func (r *Repository) GetStudentGrades(ctx context.Context, studentID uuid.UUID, academicYear string) ([]Grade, error) {
	query := `
		SELECT g.id, g.student_id, g.subject_id, g.exam_type, g.exam_name,
		       g.max_marks, g.marks_obtained, g.grade, g.remarks, g.graded_by,
		       g.exam_date, g.academic_year, g.created_at, g.updated_at,
		       COALESCE(s.name, '') as subject_name
		FROM grades g
		LEFT JOIN subjects s ON g.subject_id = s.id
		WHERE g.student_id = $1 AND g.academic_year = $2
		ORDER BY g.exam_date DESC, g.subject_id
	`

	rows, err := r.db.Query(ctx, query, studentID, academicYear)
	if err != nil {
		return nil, fmt.Errorf("failed to get grades: %w", err)
	}
	defer rows.Close()

	var grades []Grade
	for rows.Next() {
		var g Grade
		err := rows.Scan(
			&g.ID, &g.StudentID, &g.SubjectID, &g.ExamType, &g.ExamName,
			&g.MaxMarks, &g.MarksObtained, &g.Grade, &g.Remarks, &g.GradedBy,
			&g.ExamDate, &g.AcademicYear, &g.CreatedAt, &g.UpdatedAt,
			&g.SubjectName,
		)
		if err != nil {
			return nil, err
		}
		grades = append(grades, g)
	}

	return grades, nil
}

// GetAllSubjects retrieves all subjects
func (r *Repository) GetAllSubjects(ctx context.Context) ([]Subject, error) {
	query := `
		SELECT id, name, code, description, grade_levels, credits, is_optional, created_at
		FROM subjects
		ORDER BY name
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subjects []Subject
	for rows.Next() {
		var s Subject
		err := rows.Scan(&s.ID, &s.Name, &s.Code, &s.Description, &s.GradeLevels, &s.Credits, &s.IsOptional, &s.CreatedAt)
		if err != nil {
			return nil, err
		}
		subjects = append(subjects, s)
	}

	return subjects, nil
}

// CreateSubject creates a new subject
func (r *Repository) CreateSubject(ctx context.Context, subject *Subject) error {
	query := `
		INSERT INTO subjects (id, name, code, description, grade_levels, credits, is_optional, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	subject.ID = uuid.New()
	subject.CreatedAt = time.Now()

	return r.db.QueryRow(ctx, query,
		subject.ID, subject.Name, subject.Code, subject.Description,
		subject.GradeLevels, subject.Credits, subject.IsOptional, subject.CreatedAt,
	).Scan(&subject.ID)
}
