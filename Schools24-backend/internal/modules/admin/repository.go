package admin

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/schools24/backend/internal/shared/database"
	"golang.org/x/crypto/bcrypt"
)

// Repository handles database operations for admin module
type Repository struct {
	db *database.PostgresDB
}

// NewRepository creates a new admin repository
func NewRepository(db *database.PostgresDB) *Repository {
	return &Repository{db: db}
}

// GetDashboardStats retrieves admin dashboard statistics
func (r *Repository) GetDashboardStats(ctx context.Context) (*AdminDashboard, error) {
	dashboard := &AdminDashboard{}

	// Total users by role
	query := `
		SELECT 
			COUNT(*) as total,
			COUNT(*) FILTER (WHERE role = 'student') as students,
			COUNT(*) FILTER (WHERE role = 'teacher') as teachers
		FROM users WHERE is_active = true
	`
	err := r.db.QueryRow(ctx, query).Scan(&dashboard.TotalUsers, &dashboard.TotalStudents, &dashboard.TotalTeachers)
	if err != nil {
		return nil, err
	}

	// Total classes
	query = `SELECT COUNT(*) FROM classes WHERE is_active = true`
	err = r.db.QueryRow(ctx, query).Scan(&dashboard.TotalClasses)
	if err != nil {
		dashboard.TotalClasses = 0
	}

	// Fee stats
	dashboard.FeeCollection = &FeeStats{}
	query = `
		SELECT 
			COALESCE(SUM(amount), 0) as total_due,
			COALESCE(SUM(paid_amount), 0) as total_collected,
			COALESCE(SUM(amount - paid_amount - waiver_amount) FILTER (WHERE status = 'pending'), 0) as pending,
			COALESCE(SUM(amount - paid_amount - waiver_amount) FILTER (WHERE status = 'overdue'), 0) as overdue
		FROM student_fees
	`
	err = r.db.QueryRow(ctx, query).Scan(
		&dashboard.FeeCollection.TotalDue,
		&dashboard.FeeCollection.TotalCollected,
		&dashboard.FeeCollection.TotalPending,
		&dashboard.FeeCollection.TotalOverdue,
	)
	if err != nil {
		dashboard.FeeCollection = nil
	} else if dashboard.FeeCollection.TotalDue > 0 {
		dashboard.FeeCollection.CollectionRate = (dashboard.FeeCollection.TotalCollected / dashboard.FeeCollection.TotalDue) * 100
	}

	// Recent activity
	dashboard.RecentActivity, _ = r.GetRecentAuditLogs(ctx, 10)

	return dashboard, nil
}

// GetAllUsers retrieves all users with filters
func (r *Repository) GetAllUsers(ctx context.Context, role string, limit, offset int) ([]UserListItem, int, error) {
	var args []interface{}
	argNum := 1

	whereClause := "WHERE 1=1"
	if role != "" {
		whereClause += fmt.Sprintf(" AND role = $%d", argNum)
		args = append(args, role)
		argNum++
	}

	// Get total count
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM users %s`, whereClause)
	var total int
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Get users
	query := fmt.Sprintf(`
		SELECT id, email, full_name, role, phone, is_active, created_at, last_login_at
		FROM users %s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argNum, argNum+1)
	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []UserListItem
	for rows.Next() {
		var u UserListItem
		err := rows.Scan(&u.ID, &u.Email, &u.FullName, &u.Role, &u.Phone, &u.IsActive, &u.CreatedAt, &u.LastLogin)
		if err != nil {
			return nil, 0, err
		}
		users = append(users, u)
	}

	return users, total, nil
}

// GetUserByID retrieves a user by ID
func (r *Repository) GetUserByID(ctx context.Context, userID uuid.UUID) (*UserListItem, error) {
	query := `
		SELECT id, email, full_name, role, phone, is_active, created_at, last_login_at
		FROM users WHERE id = $1
	`
	var u UserListItem
	err := r.db.QueryRow(ctx, query, userID).Scan(&u.ID, &u.Email, &u.FullName, &u.Role, &u.Phone, &u.IsActive, &u.CreatedAt, &u.LastLogin)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

// CreateUser creates a new user
func (r *Repository) CreateUser(ctx context.Context, req *CreateUserRequest) (uuid.UUID, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return uuid.Nil, err
	}

	query := `
		INSERT INTO users (email, password_hash, full_name, role, phone, is_active)
		VALUES ($1, $2, $3, $4, $5, true)
		RETURNING id
	`

	var id uuid.UUID
	err = r.db.QueryRow(ctx, query, req.Email, string(hashedPassword), req.FullName, req.Role, req.Phone).Scan(&id)
	return id, err
}

// UpdateUser updates a user
func (r *Repository) UpdateUser(ctx context.Context, userID uuid.UUID, req *UpdateUserRequest) error {
	query := `
		UPDATE users SET
			email = COALESCE(NULLIF($2, ''), email),
			full_name = COALESCE(NULLIF($3, ''), full_name),
			role = COALESCE(NULLIF($4, ''), role),
			phone = COALESCE(NULLIF($5, ''), phone),
			is_active = COALESCE($6, is_active),
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	return r.db.Exec(ctx, query, userID, req.Email, req.FullName, req.Role, req.Phone, req.IsActive)
}

// DeleteUser soft deletes a user
func (r *Repository) DeleteUser(ctx context.Context, userID uuid.UUID) error {
	query := `UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`
	return r.db.Exec(ctx, query, userID)
}

// CreateStudentWithProfile creates a user and student profile
func (r *Repository) CreateStudentWithProfile(ctx context.Context, req *CreateStudentRequest) (uuid.UUID, error) {
	// Create user first
	userReq := &CreateUserRequest{
		Email:    req.Email,
		Password: req.Password,
		FullName: req.FullName,
		Role:     "student",
		Phone:    req.Phone,
	}
	userID, err := r.CreateUser(ctx, userReq)
	if err != nil {
		return uuid.Nil, err
	}

	// Create student profile
	classID, _ := uuid.Parse(req.ClassID)
	var dob *time.Time
	if req.DateOfBirth != "" {
		t, _ := time.Parse("2006-01-02", req.DateOfBirth)
		dob = &t
	}

	query := `
		INSERT INTO students (user_id, class_id, roll_number, date_of_birth, parent_name, parent_phone, address, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, true)
		RETURNING id
	`
	var studentID uuid.UUID
	err = r.db.QueryRow(ctx, query, userID, classID, req.RollNumber, dob, req.ParentName, req.ParentPhone, req.Address).Scan(&studentID)
	if err != nil {
		return uuid.Nil, err
	}

	return userID, nil
}

// CreateTeacherWithProfile creates a user and teacher profile
func (r *Repository) CreateTeacherWithProfile(ctx context.Context, req *CreateTeacherRequest) (uuid.UUID, error) {
	// Create user first
	userReq := &CreateUserRequest{
		Email:    req.Email,
		Password: req.Password,
		FullName: req.FullName,
		Role:     "teacher",
		Phone:    req.Phone,
	}
	userID, err := r.CreateUser(ctx, userReq)
	if err != nil {
		return uuid.Nil, err
	}

	// Create teacher profile
	query := `
		INSERT INTO teachers (user_id, employee_id, department, designation, qualifications, subjects_taught, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, true)
		RETURNING id
	`
	var teacherID uuid.UUID
	err = r.db.QueryRow(ctx, query, userID, req.EmployeeID, req.Department, req.Designation, req.Qualifications, req.SubjectsTaught).Scan(&teacherID)
	if err != nil {
		return uuid.Nil, err
	}

	return userID, nil
}

// GetFeeStructures retrieves all fee structures
func (r *Repository) GetFeeStructures(ctx context.Context, academicYear string) ([]FeeStructure, error) {
	query := `
		SELECT id, name, description, applicable_grades, academic_year, is_active, created_at, updated_at
		FROM fee_structures
		WHERE ($1 = '' OR academic_year = $1)
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, query, academicYear)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var structures []FeeStructure
	for rows.Next() {
		var fs FeeStructure
		err := rows.Scan(&fs.ID, &fs.Name, &fs.Description, &fs.ApplicableGrades, &fs.AcademicYear, &fs.IsActive, &fs.CreatedAt, &fs.UpdatedAt)
		if err != nil {
			return nil, err
		}
		structures = append(structures, fs)
	}

	return structures, nil
}

// CreateFeeStructure creates a fee structure with items
func (r *Repository) CreateFeeStructure(ctx context.Context, req *CreateFeeStructureRequest) (uuid.UUID, error) {
	// Create fee structure
	query := `
		INSERT INTO fee_structures (name, description, applicable_grades, academic_year, is_active)
		VALUES ($1, $2, $3, $4, true)
		RETURNING id
	`
	var structureID uuid.UUID
	err := r.db.QueryRow(ctx, query, req.Name, req.Description, req.ApplicableGrades, req.AcademicYear).Scan(&structureID)
	if err != nil {
		return uuid.Nil, err
	}

	// Create fee items
	for _, item := range req.Items {
		frequency := item.Frequency
		if frequency == "" {
			frequency = "monthly"
		}
		dueDay := item.DueDay
		if dueDay == 0 {
			dueDay = 10
		}

		itemQuery := `
			INSERT INTO fee_items (fee_structure_id, name, amount, frequency, is_optional, due_day)
			VALUES ($1, $2, $3, $4, $5, $6)
		`
		if err := r.db.Exec(ctx, itemQuery, structureID, item.Name, item.Amount, frequency, item.IsOptional, dueDay); err != nil {
			return uuid.Nil, err
		}
	}

	return structureID, nil
}

// RecordPayment records a payment
func (r *Repository) RecordPayment(ctx context.Context, collectorID uuid.UUID, req *RecordPaymentRequest) (uuid.UUID, string, error) {
	studentID, _ := uuid.Parse(req.StudentID)
	var studentFeeID *uuid.UUID
	if req.StudentFeeID != "" {
		id, _ := uuid.Parse(req.StudentFeeID)
		studentFeeID = &id
	}

	// Generate receipt number
	receiptNumber := fmt.Sprintf("RCP-%s-%d", time.Now().Format("20060102"), time.Now().UnixNano()%100000)

	query := `
		INSERT INTO payments (student_id, student_fee_id, amount, payment_method, transaction_id, receipt_number, status, notes, collected_by)
		VALUES ($1, $2, $3, $4, $5, $6, 'completed', $7, $8)
		RETURNING id
	`

	var paymentID uuid.UUID
	err := r.db.QueryRow(ctx, query,
		studentID, studentFeeID, req.Amount, req.PaymentMethod, req.TransactionID,
		receiptNumber, req.Notes, collectorID,
	).Scan(&paymentID)
	if err != nil {
		return uuid.Nil, "", err
	}

	// Update student_fee if provided
	if studentFeeID != nil {
		updateQuery := `
			UPDATE student_fees 
			SET paid_amount = paid_amount + $2,
			    status = CASE 
			        WHEN paid_amount + $2 >= amount - waiver_amount THEN 'paid'
			        WHEN paid_amount + $2 > 0 THEN 'partial'
			        ELSE status
			    END,
			    updated_at = CURRENT_TIMESTAMP
			WHERE id = $1
		`
		r.db.Exec(ctx, updateQuery, studentFeeID, req.Amount)
	}

	return paymentID, receiptNumber, nil
}

// GetRecentPayments retrieves recent payments
func (r *Repository) GetRecentPayments(ctx context.Context, limit int) ([]Payment, error) {
	query := `
		SELECT p.id, p.student_id, p.student_fee_id, p.amount, p.payment_method,
		       p.transaction_id, p.receipt_number, p.payment_date, p.status, p.notes,
		       p.collected_by, p.created_at,
		       u.full_name as student_name,
		       COALESCE(c.full_name, '') as collector_name
		FROM payments p
		JOIN students s ON p.student_id = s.id
		JOIN users u ON s.user_id = u.id
		LEFT JOIN users c ON p.collected_by = c.id
		ORDER BY p.payment_date DESC
		LIMIT $1
	`

	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payments []Payment
	for rows.Next() {
		var p Payment
		err := rows.Scan(
			&p.ID, &p.StudentID, &p.StudentFeeID, &p.Amount, &p.PaymentMethod,
			&p.TransactionID, &p.ReceiptNumber, &p.PaymentDate, &p.Status, &p.Notes,
			&p.CollectedBy, &p.CreatedAt,
			&p.StudentName, &p.CollectorName,
		)
		if err != nil {
			return nil, err
		}
		payments = append(payments, p)
	}

	return payments, nil
}

// LogAudit creates an audit log entry
func (r *Repository) LogAudit(ctx context.Context, userID *uuid.UUID, action, entityType string, entityID *uuid.UUID, oldValues, newValues interface{}, ipAddress, userAgent string) error {
	query := `
		INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	return r.db.Exec(ctx, query, userID, action, entityType, entityID, oldValues, newValues, ipAddress, userAgent)
}

// GetRecentAuditLogs retrieves recent audit logs
func (r *Repository) GetRecentAuditLogs(ctx context.Context, limit int) ([]AuditLog, error) {
	query := `
		SELECT a.id, a.user_id, a.action, a.entity_type, a.entity_id, a.ip_address, a.user_agent, a.created_at,
		       COALESCE(u.full_name, 'System') as user_name
		FROM audit_logs a
		LEFT JOIN users u ON a.user_id = u.id
		ORDER BY a.created_at DESC
		LIMIT $1
	`

	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []AuditLog
	for rows.Next() {
		var l AuditLog
		err := rows.Scan(&l.ID, &l.UserID, &l.Action, &l.EntityType, &l.EntityID, &l.IPAddress, &l.UserAgent, &l.CreatedAt, &l.UserName)
		if err != nil {
			return nil, err
		}
		logs = append(logs, l)
	}

	return logs, nil
}
