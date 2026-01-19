package student

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/schools24/backend/internal/shared/middleware"
)

// Handler handles HTTP requests for students
type Handler struct {
	service *Service
}

// NewHandler creates a new student handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GetDashboard returns the student's dashboard
// GET /api/v1/student/dashboard
func (h *Handler) GetDashboard(c *gin.Context) {
	userIDStr := middleware.GetUserID(c)
	if userIDStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	dashboard, err := h.service.GetDashboard(c.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, ErrStudentNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "student_not_found",
				"message": "Student profile not found. Please contact admin.",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboard)
}

// GetProfile returns the student's profile
// GET /api/v1/student/profile
func (h *Handler) GetProfile(c *gin.Context) {
	userIDStr := middleware.GetUserID(c)
	if userIDStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	profile, err := h.service.GetProfile(c.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, ErrStudentNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "student_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"student": profile})
}

// GetAttendance returns attendance records
// GET /api/v1/student/attendance
func (h *Handler) GetAttendance(c *gin.Context) {
	userIDStr := middleware.GetUserID(c)
	if userIDStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	// TODO: Parse startDate and endDate from query params
	records, stats, err := h.service.GetAttendance(c.Request.Context(), userID, time.Time{}, time.Time{})
	if err != nil {
		if errors.Is(err, ErrStudentNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "student_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"attendance": records,
		"stats":      stats,
	})
}

// GetClasses returns all available classes
// GET /api/v1/classes
func (h *Handler) GetClasses(c *gin.Context) {
	academicYear := c.Query("academic_year")

	classes, err := h.service.GetClasses(c.Request.Context(), academicYear)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"classes": classes})
}

// CreateClass creates a new class (admin only)
// POST /api/v1/classes
func (h *Handler) CreateClass(c *gin.Context) {
	var req struct {
		Name         string  `json:"name" binding:"required"`
		Grade        int     `json:"grade" binding:"required,min=1,max=12"`
		Section      *string `json:"section"`
		AcademicYear string  `json:"academic_year" binding:"required"`
		RoomNumber   *string `json:"room_number"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	class := &Class{
		Name:         req.Name,
		Grade:        req.Grade,
		Section:      req.Section,
		AcademicYear: req.AcademicYear,
		RoomNumber:   req.RoomNumber,
	}

	if err := h.service.CreateClass(c.Request.Context(), class); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"class": class})
}
