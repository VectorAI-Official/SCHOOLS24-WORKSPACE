package teacher

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/schools24/backend/internal/config"
)

// Service handles teacher business logic
type Service struct {
	repo   *Repository
	config *config.Config
}

// Common errors
var (
	ErrTeacherNotFound = errors.New("teacher not found")
	ErrNotAuthorized   = errors.New("not authorized for this action")
	ErrInvalidClass    = errors.New("invalid or unauthorized class")
)

// NewService creates a new teacher service
func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{
		repo:   repo,
		config: cfg,
	}
}

// GetDashboard returns the teacher's dashboard data
func (s *Service) GetDashboard(ctx context.Context, userID uuid.UUID) (*TeacherDashboard, error) {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if teacher == nil {
		return nil, ErrTeacherNotFound
	}

	academicYear := getCurrentAcademicYear()

	// Get assigned classes
	assignments, err := s.repo.GetTeacherAssignments(ctx, teacher.ID, academicYear)
	if err != nil {
		return nil, err
	}

	// Get today's schedule
	dayOfWeek := int(time.Now().Weekday())
	todaySchedule, err := s.repo.GetTodaySchedule(ctx, teacher.ID, dayOfWeek, academicYear)
	if err != nil {
		return nil, err
	}

	// Get student count
	studentCount, err := s.repo.GetStudentCountByClasses(ctx, teacher.ID, academicYear)
	if err != nil {
		studentCount = 0
	}

	// Get pending homework
	pendingHomework, err := s.repo.GetPendingHomeworkCount(ctx, teacher.ID)
	if err != nil {
		pendingHomework = 0
	}

	// Get announcements
	announcements, err := s.repo.GetRecentAnnouncements(ctx, 5)
	if err != nil {
		announcements = []Announcement{}
	}

	return &TeacherDashboard{
		Teacher:             teacher,
		AssignedClasses:     assignments,
		TodaySchedule:       todaySchedule,
		PendingHomework:     pendingHomework,
		TotalStudents:       studentCount,
		AttendanceToday:     nil, // TODO: Calculate from today's attendance
		RecentAnnouncements: announcements,
	}, nil
}

// GetProfile returns the teacher's profile
func (s *Service) GetProfile(ctx context.Context, userID uuid.UUID) (*Teacher, error) {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if teacher == nil {
		return nil, ErrTeacherNotFound
	}
	return teacher, nil
}

// GetAssignedClasses returns classes assigned to the teacher
func (s *Service) GetAssignedClasses(ctx context.Context, userID uuid.UUID) ([]TeacherAssignment, error) {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if teacher == nil {
		return nil, ErrTeacherNotFound
	}

	academicYear := getCurrentAcademicYear()
	return s.repo.GetTeacherAssignments(ctx, teacher.ID, academicYear)
}

// GetStudentsByClass returns students in a class
func (s *Service) GetStudentsByClass(ctx context.Context, userID, classID uuid.UUID) ([]StudentInfo, error) {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if teacher == nil {
		return nil, ErrTeacherNotFound
	}

	// TODO: Verify teacher is assigned to this class
	return s.repo.GetStudentsByClass(ctx, classID)
}

// MarkAttendance marks attendance for a class
func (s *Service) MarkAttendance(ctx context.Context, userID uuid.UUID, req *MarkAttendanceRequest, attendanceData []StudentAttendance, photoURL string) error {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return err
	}
	if teacher == nil {
		return ErrTeacherNotFound
	}

	classID, err := uuid.Parse(req.ClassID)
	if err != nil {
		return ErrInvalidClass
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return errors.New("invalid date format, use YYYY-MM-DD")
	}

	return s.repo.MarkAttendance(ctx, teacher.ID, classID, date, attendanceData, photoURL)
}

// CreateHomework creates a new homework assignment
func (s *Service) CreateHomework(ctx context.Context, userID uuid.UUID, req *CreateHomeworkRequest) (uuid.UUID, error) {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return uuid.Nil, err
	}
	if teacher == nil {
		return uuid.Nil, ErrTeacherNotFound
	}

	return s.repo.CreateHomework(ctx, teacher.ID, req)
}

// EnterGrade enters a grade for a student
func (s *Service) EnterGrade(ctx context.Context, userID uuid.UUID, req *EnterGradeRequest) error {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return err
	}
	if teacher == nil {
		return ErrTeacherNotFound
	}

	return s.repo.EnterGrade(ctx, teacher.ID, req)
}

// CreateAnnouncement creates a new announcement
func (s *Service) CreateAnnouncement(ctx context.Context, userID uuid.UUID, req *CreateAnnouncementRequest) (uuid.UUID, error) {
	teacher, err := s.repo.GetTeacherByUserID(ctx, userID)
	if err != nil {
		return uuid.Nil, err
	}
	if teacher == nil {
		return uuid.Nil, ErrTeacherNotFound
	}

	return s.repo.CreateAnnouncement(ctx, userID, req)
}

// GetAnnouncements returns recent announcements
func (s *Service) GetAnnouncements(ctx context.Context, limit int) ([]Announcement, error) {
	if limit <= 0 {
		limit = 20
	}
	return s.repo.GetRecentAnnouncements(ctx, limit)
}
