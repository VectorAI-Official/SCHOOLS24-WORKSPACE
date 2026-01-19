package admin

import (
	"time"

	"github.com/google/uuid"
)

// AdminDashboard represents the admin dashboard data
type AdminDashboard struct {
	TotalUsers      int                 `json:"total_users"`
	TotalStudents   int                 `json:"total_students"`
	TotalTeachers   int                 `json:"total_teachers"`
	TotalClasses    int                 `json:"total_classes"`
	FeeCollection   *FeeStats           `json:"fee_collection"`
	AttendanceStats *AttendanceOverview `json:"attendance_stats"`
	RecentActivity  []AuditLog          `json:"recent_activity"`
}

// FeeStats summarizes fee collection
type FeeStats struct {
	TotalDue       float64 `json:"total_due"`
	TotalCollected float64 `json:"total_collected"`
	TotalPending   float64 `json:"total_pending"`
	TotalOverdue   float64 `json:"total_overdue"`
	CollectionRate float64 `json:"collection_rate_percent"`
}

// AttendanceOverview for admin dashboard
type AttendanceOverview struct {
	TodayPresent int     `json:"today_present"`
	TodayAbsent  int     `json:"today_absent"`
	TodayLate    int     `json:"today_late"`
	WeekAverage  float64 `json:"week_average_percent"`
	MonthAverage float64 `json:"month_average_percent"`
}

// FeeStructure represents a fee structure
type FeeStructure struct {
	ID               uuid.UUID `json:"id" db:"id"`
	Name             string    `json:"name" db:"name"`
	Description      *string   `json:"description,omitempty" db:"description"`
	ApplicableGrades []int     `json:"applicable_grades,omitempty" db:"applicable_grades"`
	AcademicYear     string    `json:"academic_year" db:"academic_year"`
	IsActive         bool      `json:"is_active" db:"is_active"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`

	// Nested
	Items []FeeItem `json:"items,omitempty"`
}

// FeeItem represents a fee item within a structure
type FeeItem struct {
	ID             uuid.UUID `json:"id" db:"id"`
	FeeStructureID uuid.UUID `json:"fee_structure_id" db:"fee_structure_id"`
	Name           string    `json:"name" db:"name"`
	Amount         float64   `json:"amount" db:"amount"`
	Frequency      string    `json:"frequency" db:"frequency"` // one_time, monthly, quarterly, yearly
	IsOptional     bool      `json:"is_optional" db:"is_optional"`
	DueDay         int       `json:"due_day" db:"due_day"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

// StudentFee represents an assigned fee for a student
type StudentFee struct {
	ID           uuid.UUID `json:"id" db:"id"`
	StudentID    uuid.UUID `json:"student_id" db:"student_id"`
	FeeItemID    uuid.UUID `json:"fee_item_id" db:"fee_item_id"`
	Amount       float64   `json:"amount" db:"amount"`
	DueDate      time.Time `json:"due_date" db:"due_date"`
	Status       string    `json:"status" db:"status"` // pending, paid, partial, overdue, waived
	PaidAmount   float64   `json:"paid_amount" db:"paid_amount"`
	WaiverAmount float64   `json:"waiver_amount" db:"waiver_amount"`
	WaiverReason *string   `json:"waiver_reason,omitempty" db:"waiver_reason"`
	AcademicYear string    `json:"academic_year" db:"academic_year"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`

	// Joined fields
	StudentName string `json:"student_name,omitempty"`
	FeeItemName string `json:"fee_item_name,omitempty"`
	ClassName   string `json:"class_name,omitempty"`
}

// Payment represents a payment transaction
type Payment struct {
	ID            uuid.UUID  `json:"id" db:"id"`
	StudentID     uuid.UUID  `json:"student_id" db:"student_id"`
	StudentFeeID  *uuid.UUID `json:"student_fee_id,omitempty" db:"student_fee_id"`
	Amount        float64    `json:"amount" db:"amount"`
	PaymentMethod string     `json:"payment_method" db:"payment_method"` // cash, card, upi, bank_transfer, cheque, online
	TransactionID *string    `json:"transaction_id,omitempty" db:"transaction_id"`
	ReceiptNumber string     `json:"receipt_number" db:"receipt_number"`
	PaymentDate   time.Time  `json:"payment_date" db:"payment_date"`
	Status        string     `json:"status" db:"status"` // pending, completed, failed, refunded
	Notes         *string    `json:"notes,omitempty" db:"notes"`
	CollectedBy   *uuid.UUID `json:"collected_by,omitempty" db:"collected_by"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`

	// Joined fields
	StudentName   string `json:"student_name,omitempty"`
	CollectorName string `json:"collector_name,omitempty"`
}

// AuditLog represents an audit log entry
type AuditLog struct {
	ID         uuid.UUID   `json:"id" db:"id"`
	UserID     *uuid.UUID  `json:"user_id,omitempty" db:"user_id"`
	Action     string      `json:"action" db:"action"`
	EntityType string      `json:"entity_type" db:"entity_type"`
	EntityID   *uuid.UUID  `json:"entity_id,omitempty" db:"entity_id"`
	OldValues  interface{} `json:"old_values,omitempty" db:"old_values"`
	NewValues  interface{} `json:"new_values,omitempty" db:"new_values"`
	IPAddress  *string     `json:"ip_address,omitempty" db:"ip_address"`
	UserAgent  *string     `json:"user_agent,omitempty" db:"user_agent"`
	CreatedAt  time.Time   `json:"created_at" db:"created_at"`

	// Joined fields
	UserName string `json:"user_name,omitempty"`
}

// Request types

// CreateUserRequest for admin creating users
type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Role     string `json:"role" binding:"required"` // student, teacher, admin, staff, parent
	Phone    string `json:"phone,omitempty"`
}

// UpdateUserRequest for admin updating users
type UpdateUserRequest struct {
	Email    string `json:"email,omitempty"`
	FullName string `json:"full_name,omitempty"`
	Role     string `json:"role,omitempty"`
	Phone    string `json:"phone,omitempty"`
	IsActive *bool  `json:"is_active,omitempty"`
}

// CreateStudentRequest for creating student with profile
type CreateStudentRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=6"`
	FullName    string `json:"full_name" binding:"required"`
	Phone       string `json:"phone,omitempty"`
	ClassID     string `json:"class_id" binding:"required"`
	RollNumber  string `json:"roll_number" binding:"required"`
	DateOfBirth string `json:"date_of_birth,omitempty"` // YYYY-MM-DD
	ParentName  string `json:"parent_name,omitempty"`
	ParentPhone string `json:"parent_phone,omitempty"`
	Address     string `json:"address,omitempty"`
}

// CreateTeacherRequest for creating teacher with profile
type CreateTeacherRequest struct {
	Email          string   `json:"email" binding:"required,email"`
	Password       string   `json:"password" binding:"required,min=6"`
	FullName       string   `json:"full_name" binding:"required"`
	Phone          string   `json:"phone,omitempty"`
	EmployeeID     string   `json:"employee_id" binding:"required"`
	Department     string   `json:"department,omitempty"`
	Designation    string   `json:"designation,omitempty"`
	Qualifications []string `json:"qualifications,omitempty"`
	SubjectsTaught []string `json:"subjects_taught,omitempty"`
}

// CreateFeeStructureRequest for creating fee structure
type CreateFeeStructureRequest struct {
	Name             string         `json:"name" binding:"required"`
	Description      string         `json:"description,omitempty"`
	ApplicableGrades []int          `json:"applicable_grades,omitempty"`
	AcademicYear     string         `json:"academic_year" binding:"required"`
	Items            []FeeItemInput `json:"items,omitempty"`
}

// FeeItemInput for creating fee items
type FeeItemInput struct {
	Name       string  `json:"name" binding:"required"`
	Amount     float64 `json:"amount" binding:"required"`
	Frequency  string  `json:"frequency"` // one_time, monthly, quarterly, yearly
	IsOptional bool    `json:"is_optional"`
	DueDay     int     `json:"due_day"`
}

// RecordPaymentRequest for recording a payment
type RecordPaymentRequest struct {
	StudentID     string  `json:"student_id" binding:"required"`
	StudentFeeID  string  `json:"student_fee_id,omitempty"`
	Amount        float64 `json:"amount" binding:"required,gt=0"`
	PaymentMethod string  `json:"payment_method" binding:"required"` // cash, card, upi, bank_transfer, cheque, online
	TransactionID string  `json:"transaction_id,omitempty"`
	Notes         string  `json:"notes,omitempty"`
}

// UserListItem for user listing
type UserListItem struct {
	ID        uuid.UUID  `json:"id"`
	Email     string     `json:"email"`
	FullName  string     `json:"full_name"`
	Role      string     `json:"role"`
	Phone     *string    `json:"phone,omitempty"`
	IsActive  bool       `json:"is_active"`
	CreatedAt time.Time  `json:"created_at"`
	LastLogin *time.Time `json:"last_login,omitempty"`
}
