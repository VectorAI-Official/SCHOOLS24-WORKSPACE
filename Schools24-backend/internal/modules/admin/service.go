package admin

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/schools24/backend/internal/config"
)

// Service handles admin business logic
type Service struct {
	repo   *Repository
	config *config.Config
}

// Common errors
var (
	ErrUserNotFound  = errors.New("user not found")
	ErrEmailExists   = errors.New("email already exists")
	ErrNotAuthorized = errors.New("not authorized for this action")
	ErrInvalidInput  = errors.New("invalid input")
)

// NewService creates a new admin service
func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{
		repo:   repo,
		config: cfg,
	}
}

// GetDashboard returns admin dashboard data
func (s *Service) GetDashboard(ctx context.Context) (*AdminDashboard, error) {
	return s.repo.GetDashboardStats(ctx)
}

// GetUsers returns paginated list of users
func (s *Service) GetUsers(ctx context.Context, role string, page, pageSize int) ([]UserListItem, int, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize
	return s.repo.GetAllUsers(ctx, role, pageSize, offset)
}

// GetUserByID returns a user by ID
func (s *Service) GetUserByID(ctx context.Context, userID uuid.UUID) (*UserListItem, error) {
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

// CreateUser creates a new user
func (s *Service) CreateUser(ctx context.Context, req *CreateUserRequest) (uuid.UUID, error) {
	if req.Role != "student" && req.Role != "teacher" && req.Role != "admin" && req.Role != "staff" && req.Role != "parent" {
		return uuid.Nil, ErrInvalidInput
	}
	return s.repo.CreateUser(ctx, req)
}

// UpdateUser updates a user
func (s *Service) UpdateUser(ctx context.Context, userID uuid.UUID, req *UpdateUserRequest) error {
	existing, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrUserNotFound
	}
	return s.repo.UpdateUser(ctx, userID, req)
}

// DeleteUser soft deletes a user
func (s *Service) DeleteUser(ctx context.Context, userID uuid.UUID) error {
	existing, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrUserNotFound
	}
	return s.repo.DeleteUser(ctx, userID)
}

// CreateStudent creates a student with profile
func (s *Service) CreateStudent(ctx context.Context, req *CreateStudentRequest) (uuid.UUID, error) {
	return s.repo.CreateStudentWithProfile(ctx, req)
}

// CreateTeacher creates a teacher with profile
func (s *Service) CreateTeacher(ctx context.Context, req *CreateTeacherRequest) (uuid.UUID, error) {
	return s.repo.CreateTeacherWithProfile(ctx, req)
}

// GetFeeStructures returns fee structures
func (s *Service) GetFeeStructures(ctx context.Context, academicYear string) ([]FeeStructure, error) {
	return s.repo.GetFeeStructures(ctx, academicYear)
}

// CreateFeeStructure creates a fee structure
func (s *Service) CreateFeeStructure(ctx context.Context, req *CreateFeeStructureRequest) (uuid.UUID, error) {
	return s.repo.CreateFeeStructure(ctx, req)
}

// RecordPayment records a payment
func (s *Service) RecordPayment(ctx context.Context, collectorID uuid.UUID, req *RecordPaymentRequest) (uuid.UUID, string, error) {
	return s.repo.RecordPayment(ctx, collectorID, req)
}

// GetRecentPayments returns recent payments
func (s *Service) GetRecentPayments(ctx context.Context, limit int) ([]Payment, error) {
	if limit <= 0 {
		limit = 20
	}
	return s.repo.GetRecentPayments(ctx, limit)
}

// GetAuditLogs returns audit logs
func (s *Service) GetAuditLogs(ctx context.Context, limit int) ([]AuditLog, error) {
	if limit <= 0 {
		limit = 50
	}
	return s.repo.GetRecentAuditLogs(ctx, limit)
}

// LogActivity logs an activity
func (s *Service) LogActivity(ctx context.Context, userID *uuid.UUID, action, entityType string, entityID *uuid.UUID, ipAddress, userAgent string) {
	s.repo.LogAudit(ctx, userID, action, entityType, entityID, nil, nil, ipAddress, userAgent)
}
