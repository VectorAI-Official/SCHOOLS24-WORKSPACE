package teacher

import (
	"time"

	"github.com/google/uuid"
)

// Teacher represents a teacher profile
type Teacher struct {
	ID             uuid.UUID  `json:"id" db:"id"`
	UserID         uuid.UUID  `json:"user_id" db:"user_id"`
	EmployeeID     string     `json:"employee_id" db:"employee_id"`
	Department     *string    `json:"department,omitempty" db:"department"`
	Designation    *string    `json:"designation,omitempty" db:"designation"`
	Qualifications []string   `json:"qualifications,omitempty" db:"qualifications"`
	JoiningDate    *time.Time `json:"joining_date,omitempty" db:"joining_date"`
	SubjectsTaught []string   `json:"subjects_taught,omitempty" db:"subjects_taught"`
	Experience     *int       `json:"experience_years,omitempty" db:"experience_years"`
	IsActive       bool       `json:"is_active" db:"is_active"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at" db:"updated_at"`

	// Joined fields
	FullName string `json:"full_name,omitempty"`
	Email    string `json:"email,omitempty"`
	Phone    string `json:"phone,omitempty"`
	Avatar   string `json:"avatar,omitempty"`
}

// TeacherAssignment represents a teacher's class/subject assignment
type TeacherAssignment struct {
	ID             uuid.UUID  `json:"id" db:"id"`
	TeacherID      uuid.UUID  `json:"teacher_id" db:"teacher_id"`
	ClassID        uuid.UUID  `json:"class_id" db:"class_id"`
	SubjectID      *uuid.UUID `json:"subject_id,omitempty" db:"subject_id"`
	IsClassTeacher bool       `json:"is_class_teacher" db:"is_class_teacher"`
	AcademicYear   string     `json:"academic_year" db:"academic_year"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at" db:"updated_at"`

	// Joined fields
	ClassName   string `json:"class_name,omitempty"`
	SubjectName string `json:"subject_name,omitempty"`
}

// TeacherDashboard represents the teacher dashboard data
type TeacherDashboard struct {
	Teacher             *Teacher            `json:"teacher"`
	AssignedClasses     []TeacherAssignment `json:"assigned_classes"`
	TodaySchedule       []TodayPeriod       `json:"today_schedule"`
	PendingHomework     int                 `json:"pending_homework_to_grade"`
	TotalStudents       int                 `json:"total_students"`
	AttendanceToday     *AttendanceSummary  `json:"attendance_today"`
	RecentAnnouncements []Announcement      `json:"recent_announcements"`
}

// TodayPeriod represents a period in today's schedule
type TodayPeriod struct {
	PeriodNumber int    `json:"period_number"`
	StartTime    string `json:"start_time"`
	EndTime      string `json:"end_time"`
	ClassName    string `json:"class_name"`
	SubjectName  string `json:"subject_name"`
	RoomNumber   string `json:"room_number,omitempty"`
}

// AttendanceSummary for a class
type AttendanceSummary struct {
	TotalStudents int `json:"total_students"`
	Present       int `json:"present"`
	Absent        int `json:"absent"`
	Late          int `json:"late"`
}

// Announcement represents a school announcement
type Announcement struct {
	ID         uuid.UUID  `json:"id" db:"id"`
	Title      string     `json:"title" db:"title"`
	Content    string     `json:"content" db:"content"`
	AuthorID   uuid.UUID  `json:"author_id" db:"author_id"`
	TargetType string     `json:"target_type" db:"target_type"` // all, class, grade, teachers, parents
	TargetID   *uuid.UUID `json:"target_id,omitempty" db:"target_id"`
	Priority   string     `json:"priority" db:"priority"` // low, normal, high, urgent
	IsPinned   bool       `json:"is_pinned" db:"is_pinned"`
	ExpiresAt  *time.Time `json:"expires_at,omitempty" db:"expires_at"`
	CreatedAt  time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at" db:"updated_at"`

	// Joined fields
	AuthorName string `json:"author_name,omitempty"`
}

// Message represents a message between users
type Message struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	SenderID    uuid.UUID  `json:"sender_id" db:"sender_id"`
	RecipientID uuid.UUID  `json:"recipient_id" db:"recipient_id"`
	Subject     *string    `json:"subject,omitempty" db:"subject"`
	Content     string     `json:"content" db:"content"`
	IsRead      bool       `json:"is_read" db:"is_read"`
	ReadAt      *time.Time `json:"read_at,omitempty" db:"read_at"`
	ParentID    *uuid.UUID `json:"parent_id,omitempty" db:"parent_id"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`

	// Joined fields
	SenderName    string `json:"sender_name,omitempty"`
	RecipientName string `json:"recipient_name,omitempty"`
}

// Request types

// MarkAttendanceRequest for marking class attendance
type MarkAttendanceRequest struct {
	ClassID    string `form:"class_id" binding:"required"`
	Date       string `form:"date" binding:"required"`       // YYYY-MM-DD
	Attendance string `form:"attendance" binding:"required"` // JSON string of []StudentAttendance
	Photo      *any   `form:"photo,omitempty"`               // Handled manually in handler
}

// StudentAttendance for individual student
type StudentAttendance struct {
	StudentID string `json:"student_id" binding:"required"`
	Status    string `json:"status" binding:"required"` // present, absent, late
	Remarks   string `json:"remarks,omitempty"`
}

// CreateHomeworkRequest for teachers
type CreateHomeworkRequest struct {
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description,omitempty"`
	ClassID     string   `json:"class_id" binding:"required"`
	SubjectID   string   `json:"subject_id,omitempty"`
	DueDate     string   `json:"due_date" binding:"required"` // RFC3339
	MaxMarks    int      `json:"max_marks"`
	Attachments []string `json:"attachments,omitempty"`
}

// EnterGradeRequest for entering student grades
type EnterGradeRequest struct {
	StudentID     string  `json:"student_id" binding:"required"`
	SubjectID     string  `json:"subject_id,omitempty"`
	ExamType      string  `json:"exam_type" binding:"required"` // FA1, FA2, SA1, SA2, Quiz
	ExamName      string  `json:"exam_name" binding:"required"`
	MaxMarks      int     `json:"max_marks" binding:"required"`
	MarksObtained float64 `json:"marks_obtained" binding:"required"`
	Remarks       string  `json:"remarks,omitempty"`
	ExamDate      string  `json:"exam_date,omitempty"` // YYYY-MM-DD
}

// CreateAnnouncementRequest for creating announcements
type CreateAnnouncementRequest struct {
	Title      string `json:"title" binding:"required"`
	Content    string `json:"content" binding:"required"`
	TargetType string `json:"target_type" binding:"required"` // all, class, grade, teachers
	TargetID   string `json:"target_id,omitempty"`
	Priority   string `json:"priority,omitempty"` // low, normal, high, urgent
	IsPinned   bool   `json:"is_pinned,omitempty"`
	ExpiresAt  string `json:"expires_at,omitempty"` // RFC3339
}

// SendMessageRequest for sending messages
type SendMessageRequest struct {
	RecipientID string `json:"recipient_id" binding:"required"`
	Subject     string `json:"subject,omitempty"`
	Content     string `json:"content" binding:"required"`
	ParentID    string `json:"parent_id,omitempty"` // For replies
}
