package academic

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/schools24/backend/internal/config"
	"github.com/schools24/backend/internal/modules/student"
)

// Service handles academic business logic
type Service struct {
	repo        *Repository
	studentRepo *student.Repository
	config      *config.Config
}

// Common errors
var (
	ErrHomeworkNotFound = errors.New("homework not found")
	ErrNotAuthorized    = errors.New("not authorized for this action")
	ErrAlreadySubmitted = errors.New("already submitted")
)

// NewService creates a new academic service
func NewService(repo *Repository, studentRepo *student.Repository, cfg *config.Config) *Service {
	return &Service{
		repo:        repo,
		studentRepo: studentRepo,
		config:      cfg,
	}
}

// GetTimetable returns the timetable for a student's class
func (s *Service) GetTimetable(ctx context.Context, userID uuid.UUID) ([]DaySchedule, error) {
	// Get student info
	studentProfile, err := s.studentRepo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if studentProfile == nil || studentProfile.ClassID == nil {
		return nil, student.ErrStudentNotFound
	}

	academicYear := getCurrentAcademicYear()
	timetables, err := s.repo.GetTimetableByClassID(ctx, *studentProfile.ClassID, academicYear)
	if err != nil {
		return nil, err
	}

	// Group by day of week
	dayMap := make(map[int][]Timetable)
	for _, t := range timetables {
		dayMap[t.DayOfWeek] = append(dayMap[t.DayOfWeek], t)
	}

	// Create day schedules (Monday to Saturday for Indian schools)
	var schedules []DaySchedule
	for day := 1; day <= 6; day++ { // 1=Monday to 6=Saturday
		schedule := DaySchedule{
			DayOfWeek: day,
			DayName:   GetDayName(day),
			Periods:   dayMap[day],
		}
		if schedule.Periods == nil {
			schedule.Periods = []Timetable{}
		}
		schedules = append(schedules, schedule)
	}

	return schedules, nil
}

// GetHomework returns homework for a student's class
func (s *Service) GetHomework(ctx context.Context, userID uuid.UUID, status string) ([]Homework, error) {
	studentProfile, err := s.studentRepo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if studentProfile == nil || studentProfile.ClassID == nil {
		return nil, student.ErrStudentNotFound
	}

	if status == "" {
		status = "active"
	}

	return s.repo.GetHomeworkByClassID(ctx, *studentProfile.ClassID, status)
}

// GetHomeworkByID returns a single homework
func (s *Service) GetHomeworkByID(ctx context.Context, homeworkID uuid.UUID) (*Homework, error) {
	hw, err := s.repo.GetHomeworkByID(ctx, homeworkID)
	if err != nil {
		return nil, err
	}
	if hw == nil {
		return nil, ErrHomeworkNotFound
	}
	return hw, nil
}

// SubmitHomework submits homework for a student
func (s *Service) SubmitHomework(ctx context.Context, userID uuid.UUID, homeworkID uuid.UUID, req *SubmitHomeworkRequest) error {
	studentProfile, err := s.studentRepo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return err
	}
	if studentProfile == nil {
		return student.ErrStudentNotFound
	}

	// Check if homework exists
	hw, err := s.repo.GetHomeworkByID(ctx, homeworkID)
	if err != nil {
		return err
	}
	if hw == nil {
		return ErrHomeworkNotFound
	}

	submission := &HomeworkSubmission{
		HomeworkID:     homeworkID,
		StudentID:      studentProfile.ID,
		SubmissionText: &req.SubmissionText,
		Attachments:    req.Attachments,
	}

	return s.repo.SubmitHomework(ctx, submission)
}

// GetGrades returns grades for a student
func (s *Service) GetGrades(ctx context.Context, userID uuid.UUID, academicYear string) ([]Grade, error) {
	studentProfile, err := s.studentRepo.GetStudentByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if studentProfile == nil {
		return nil, student.ErrStudentNotFound
	}

	if academicYear == "" {
		academicYear = getCurrentAcademicYear()
	}

	return s.repo.GetStudentGrades(ctx, studentProfile.ID, academicYear)
}

// GetSubjects returns all subjects
func (s *Service) GetSubjects(ctx context.Context) ([]Subject, error) {
	return s.repo.GetAllSubjects(ctx)
}

// CreateSubject creates a new subject (admin only)
func (s *Service) CreateSubject(ctx context.Context, subject *Subject) error {
	return s.repo.CreateSubject(ctx, subject)
}

// getCurrentAcademicYear returns current academic year
func getCurrentAcademicYear() string {
	now := time.Now()
	year := now.Year()
	month := now.Month()

	if month < time.April {
		return time.Date(year-1, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006") + "-" + time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006")
	}
	return time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006") + "-" + time.Date(year+1, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006")
}
