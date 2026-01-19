package database

import (
	"context"
	"log"
)

// RunAcademicMigrations creates academic-related tables
func (db *PostgresDB) RunAcademicMigrations(ctx context.Context) error {
	log.Println("Running academic-related migrations...")

	// Timetables table
	timetablesTable := `
		CREATE TABLE IF NOT EXISTS timetables (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
			day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
			period_number INT NOT NULL CHECK (period_number >= 1 AND period_number <= 10),
			subject_id UUID REFERENCES subjects(id),
			teacher_id UUID REFERENCES teachers(id),
			start_time TIME NOT NULL,
			end_time TIME NOT NULL,
			room_number VARCHAR(50),
			academic_year VARCHAR(20) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(class_id, day_of_week, period_number, academic_year)
		);

		CREATE INDEX IF NOT EXISTS idx_timetables_class_id ON timetables(class_id);
		CREATE INDEX IF NOT EXISTS idx_timetables_day_of_week ON timetables(day_of_week);
	`
	if err := db.Exec(ctx, timetablesTable); err != nil {
		return err
	}
	log.Println("✓ timetables table ready")

	// Homework table
	homeworkTable := `
		CREATE TABLE IF NOT EXISTS homework (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			title VARCHAR(255) NOT NULL,
			description TEXT,
			class_id UUID NOT NULL REFERENCES classes(id),
			subject_id UUID REFERENCES subjects(id),
			teacher_id UUID NOT NULL REFERENCES teachers(id),
			due_date TIMESTAMP NOT NULL,
			max_marks INT DEFAULT 100,
			attachments TEXT[],
			status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX IF NOT EXISTS idx_homework_class_id ON homework(class_id);
		CREATE INDEX IF NOT EXISTS idx_homework_due_date ON homework(due_date);
		CREATE INDEX IF NOT EXISTS idx_homework_teacher_id ON homework(teacher_id);
	`
	if err := db.Exec(ctx, homeworkTable); err != nil {
		return err
	}
	log.Println("✓ homework table ready")

	// Homework submissions table
	homeworkSubmissionsTable := `
		CREATE TABLE IF NOT EXISTS homework_submissions (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
			student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			submission_text TEXT,
			attachments TEXT[],
			submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			marks_obtained INT,
			feedback TEXT,
			graded_by UUID REFERENCES teachers(id),
			graded_at TIMESTAMP,
			status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'returned')),
			UNIQUE(homework_id, student_id)
		);

		CREATE INDEX IF NOT EXISTS idx_homework_submissions_homework_id ON homework_submissions(homework_id);
		CREATE INDEX IF NOT EXISTS idx_homework_submissions_student_id ON homework_submissions(student_id);
	`
	if err := db.Exec(ctx, homeworkSubmissionsTable); err != nil {
		return err
	}
	log.Println("✓ homework_submissions table ready")

	// Grades table
	gradesTable := `
		CREATE TABLE IF NOT EXISTS grades (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			subject_id UUID REFERENCES subjects(id),
			exam_type VARCHAR(50) NOT NULL,
			exam_name VARCHAR(255) NOT NULL,
			max_marks INT NOT NULL,
			marks_obtained DECIMAL(5,2) NOT NULL,
			grade VARCHAR(5),
			remarks TEXT,
			graded_by UUID REFERENCES teachers(id),
			exam_date DATE,
			academic_year VARCHAR(20),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
		CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);
		CREATE INDEX IF NOT EXISTS idx_grades_exam_type ON grades(exam_type);
	`
	if err := db.Exec(ctx, gradesTable); err != nil {
		return err
	}
	log.Println("✓ grades table ready")

	log.Println("All academic migrations completed!")
	return nil
}
