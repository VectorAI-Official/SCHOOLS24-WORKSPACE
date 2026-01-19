package student

import (
	"time"

	"github.com/google/uuid"
)

// Student represents a student profile linked to a user
type Student struct {
	ID               uuid.UUID  `json:"id" db:"id"`
	UserID           uuid.UUID  `json:"user_id" db:"user_id"`
	AdmissionNumber  string     `json:"admission_number" db:"admission_number"`
	RollNumber       *string    `json:"roll_number,omitempty" db:"roll_number"`
	ClassID          *uuid.UUID `json:"class_id,omitempty" db:"class_id"`
	Section          *string    `json:"section,omitempty" db:"section"`
	DateOfBirth      time.Time  `json:"date_of_birth" db:"date_of_birth"`
	Gender           string     `json:"gender" db:"gender"`
	BloodGroup       *string    `json:"blood_group,omitempty" db:"blood_group"`
	Address          *string    `json:"address,omitempty" db:"address"`
	ParentName       *string    `json:"parent_name,omitempty" db:"parent_name"`
	ParentEmail      *string    `json:"parent_email,omitempty" db:"parent_email"`
	ParentPhone      *string    `json:"parent_phone,omitempty" db:"parent_phone"`
	EmergencyContact *string    `json:"emergency_contact,omitempty" db:"emergency_contact"`
	AdmissionDate    time.Time  `json:"admission_date" db:"admission_date"`
	AcademicYear     string     `json:"academic_year" db:"academic_year"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at" db:"updated_at"`

	// Joined fields
	FullName  string `json:"full_name,omitempty"`
	Email     string `json:"email,omitempty"`
	ClassName string `json:"class_name,omitempty"`
}

// Class represents a school class
type Class struct {
	ID             uuid.UUID  `json:"id" db:"id"`
	Name           string     `json:"name" db:"name"`
	Grade          int        `json:"grade" db:"grade"`
	Section        *string    `json:"section,omitempty" db:"section"`
	ClassTeacherID *uuid.UUID `json:"class_teacher_id,omitempty" db:"class_teacher_id"`
	AcademicYear   string     `json:"academic_year" db:"academic_year"`
	TotalStudents  int        `json:"total_students" db:"total_students"`
	RoomNumber     *string    `json:"room_number,omitempty" db:"room_number"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at" db:"updated_at"`

	// Joined fields
	ClassTeacherName string `json:"class_teacher_name,omitempty"`
}

// Attendance represents daily attendance record
type Attendance struct {
	ID        uuid.UUID  `json:"id" db:"id"`
	StudentID uuid.UUID  `json:"student_id" db:"student_id"`
	ClassID   uuid.UUID  `json:"class_id" db:"class_id"`
	Date      time.Time  `json:"date" db:"date"`
	Status    string     `json:"status" db:"status"` // present, absent, late, excused
	MarkedBy  *uuid.UUID `json:"marked_by,omitempty" db:"marked_by"`
	Remarks   *string    `json:"remarks,omitempty" db:"remarks"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
}

// AttendanceStatus constants
const (
	StatusPresent = "present"
	StatusAbsent  = "absent"
	StatusLate    = "late"
	StatusExcused = "excused"
)

// StudentDashboard represents dashboard data for a student
type StudentDashboard struct {
	Student          *Student          `json:"student"`
	Class            *Class            `json:"class"`
	AttendanceStats  *AttendanceStats  `json:"attendance_stats"`
	RecentAttendance []Attendance      `json:"recent_attendance"`
	UpcomingQuizzes  []UpcomingQuiz    `json:"upcoming_quizzes"`
	PendingHomework  []PendingHomework `json:"pending_homework"`
}

// AttendanceStats shows attendance summary
type AttendanceStats struct {
	TotalDays         int     `json:"total_days"`
	PresentDays       int     `json:"present_days"`
	AbsentDays        int     `json:"absent_days"`
	LateDays          int     `json:"late_days"`
	AttendancePercent float64 `json:"attendance_percent"`
}

// UpcomingQuiz for dashboard (placeholder until Quiz module)
type UpcomingQuiz struct {
	ID       uuid.UUID `json:"id"`
	Title    string    `json:"title"`
	Subject  string    `json:"subject"`
	DueDate  time.Time `json:"due_date"`
	MaxMarks int       `json:"max_marks"`
}

// PendingHomework for dashboard (placeholder until Homework module)
type PendingHomework struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Subject     string    `json:"subject"`
	DueDate     time.Time `json:"due_date"`
	Description string    `json:"description"`
}

// CreateStudentRequest for creating student profile
type CreateStudentRequest struct {
	UserID           uuid.UUID `json:"user_id" binding:"required"`
	AdmissionNumber  string    `json:"admission_number" binding:"required"`
	RollNumber       string    `json:"roll_number,omitempty"`
	ClassID          string    `json:"class_id,omitempty"`
	Section          string    `json:"section,omitempty"`
	DateOfBirth      string    `json:"date_of_birth" binding:"required"` // YYYY-MM-DD
	Gender           string    `json:"gender" binding:"required,oneof=male female other"`
	BloodGroup       string    `json:"blood_group,omitempty"`
	Address          string    `json:"address,omitempty"`
	ParentName       string    `json:"parent_name,omitempty"`
	ParentEmail      string    `json:"parent_email,omitempty"`
	ParentPhone      string    `json:"parent_phone,omitempty"`
	EmergencyContact string    `json:"emergency_contact,omitempty"`
	AcademicYear     string    `json:"academic_year" binding:"required"`
}

// UpdateStudentRequest for updating student profile
type UpdateStudentRequest struct {
	RollNumber       *string `json:"roll_number,omitempty"`
	ClassID          *string `json:"class_id,omitempty"`
	Section          *string `json:"section,omitempty"`
	BloodGroup       *string `json:"blood_group,omitempty"`
	Address          *string `json:"address,omitempty"`
	ParentName       *string `json:"parent_name,omitempty"`
	ParentEmail      *string `json:"parent_email,omitempty"`
	ParentPhone      *string `json:"parent_phone,omitempty"`
	EmergencyContact *string `json:"emergency_contact,omitempty"`
}
