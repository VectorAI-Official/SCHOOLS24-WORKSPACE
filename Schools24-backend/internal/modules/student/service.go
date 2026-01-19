package student

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/schools24/backend/internal/config"
)

// Service handles student business logic
type Service struct {
	repo   *Repository
	config *config.Config
}

// Common errors
var (
	ErrStudentNotFound = errors.New("student not found")
	ErrClassNotFound   = errors.New("class not found")
)

// NewService creates a new student service
func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{
		repo:   repo,
		config: cfg,
	}
}

// GetDashboard returns dashboard data for a student
func (s *Service) GetDashboard(ctx context.Context, userID uuid.UUID) (*StudentDashboard, error) {
	// Get student profile
	student, err := s.repo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if student == nil {
		return nil, ErrStudentNotFound
	}

	dashboard := &StudentDashboard{
		Student: student,
	}

	// Get class info if assigned
	if student.ClassID != nil {
		class, err := s.repo.GetClassByID(ctx, *student.ClassID)
		if err == nil {
			dashboard.Class = class
		}
	}

	// Get attendance stats for current month
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
	endOfMonth := startOfMonth.AddDate(0, 1, -1)

	stats, err := s.repo.GetAttendanceStats(ctx, student.ID, startOfMonth, endOfMonth)
	if err == nil {
		dashboard.AttendanceStats = stats
	}

	// Get recent attendance (last 7 days)
	recentAttendance, err := s.repo.GetRecentAttendance(ctx, student.ID, 7)
	if err == nil {
		dashboard.RecentAttendance = recentAttendance
	}

	// Placeholder for quizzes/homework (will be implemented in later phases)
	dashboard.UpcomingQuizzes = []UpcomingQuiz{}
	dashboard.PendingHomework = []PendingHomework{}

	return dashboard, nil
}

// GetProfile returns the student profile
func (s *Service) GetProfile(ctx context.Context, userID uuid.UUID) (*Student, error) {
	student, err := s.repo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if student == nil {
		return nil, ErrStudentNotFound
	}
	return student, nil
}

// GetAttendance returns attendance records for the student
func (s *Service) GetAttendance(ctx context.Context, userID uuid.UUID, startDate, endDate time.Time) ([]Attendance, *AttendanceStats, error) {
	student, err := s.repo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return nil, nil, err
	}
	if student == nil {
		return nil, nil, ErrStudentNotFound
	}

	// If no dates provided, default to current month
	if startDate.IsZero() {
		now := time.Now()
		startDate = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
		endDate = startDate.AddDate(0, 1, -1)
	}

	// Get attendance records - for now return recent
	records, err := s.repo.GetRecentAttendance(ctx, student.ID, 30)
	if err != nil {
		return nil, nil, err
	}

	stats, err := s.repo.GetAttendanceStats(ctx, student.ID, startDate, endDate)
	if err != nil {
		return nil, nil, err
	}

	return records, stats, nil
}

// GetClasses returns all available classes
func (s *Service) GetClasses(ctx context.Context, academicYear string) ([]Class, error) {
	if academicYear == "" {
		academicYear = getCurrentAcademicYear()
	}
	return s.repo.GetAllClasses(ctx, academicYear)
}

// CreateClass creates a new class (admin only)
func (s *Service) CreateClass(ctx context.Context, class *Class) error {
	return s.repo.CreateClass(ctx, class)
}

// getCurrentAcademicYear returns current academic year (e.g., "2025-2026")
func getCurrentAcademicYear() string {
	now := time.Now()
	year := now.Year()
	month := now.Month()

	// Academic year starts in April (for Indian schools)
	if month < time.April {
		return time.Date(year-1, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006") + "-" + time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006")
	}
	return time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006") + "-" + time.Date(year+1, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006")
}
