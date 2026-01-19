package teacher

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/schools24/backend/internal/shared/fileups"
	"github.com/schools24/backend/internal/shared/middleware"
)

// Handler handles HTTP requests for teacher module
type Handler struct {
	service     *Service
	fileService *fileups.Service
}

// NewHandler creates a new teacher handler
func NewHandler(service *Service) *Handler {
	// Initialize file upload service
	fileService := fileups.NewService("./uploads/attendance")
	return &Handler{service: service, fileService: fileService}
}

// GetDashboard returns the teacher's dashboard
// GET /api/v1/teacher/dashboard
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboard)
}

// GetProfile returns the teacher's profile
// GET /api/v1/teacher/profile
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// GetClasses returns assigned classes
// GET /api/v1/teacher/classes
func (h *Handler) GetClasses(c *gin.Context) {
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

	classes, err := h.service.GetAssignedClasses(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"classes": classes})
}

// GetClassStudents returns students in a class
// GET /api/v1/teacher/classes/:classId/students
func (h *Handler) GetClassStudents(c *gin.Context) {
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

	classIDStr := c.Param("classId")
	classID, err := uuid.Parse(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class ID"})
		return
	}

	students, err := h.service.GetStudentsByClass(c.Request.Context(), userID, classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"students": students})
}

// MarkAttendance marks attendance for a class
// POST /api/v1/teacher/attendance
func (h *Handler) MarkAttendance(c *gin.Context) {
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

	var req MarkAttendanceRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse JSON attendance string
	var attendanceData []StudentAttendance
	if err := json.Unmarshal([]byte(req.Attendance), &attendanceData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid attendance json format"})
		return
	}

	// Handle file upload
	photoURL := ""
	file, err := c.FormFile("photo")
	if err == nil {
		// File uploaded
		subDir := time.Now().Format("2006-01")
		photoURL, err = h.fileService.UploadFile(file, subDir)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save photo"})
			return
		}
	}

	if err := h.service.MarkAttendance(c.Request.Context(), userID, &req, attendanceData, photoURL); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attendance marked successfully", "photo_url": photoURL})
}

// CreateHomework creates a new homework assignment
// POST /api/v1/teacher/homework
func (h *Handler) CreateHomework(c *gin.Context) {
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

	var req CreateHomeworkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	homeworkID, err := h.service.CreateHomework(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": homeworkID, "message": "Homework created successfully"})
}

// EnterGrade enters a grade for a student
// POST /api/v1/teacher/grades
func (h *Handler) EnterGrade(c *gin.Context) {
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

	var req EnterGradeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.EnterGrade(c.Request.Context(), userID, &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Grade entered successfully"})
}

// CreateAnnouncement creates a new announcement
// POST /api/v1/teacher/announcements
func (h *Handler) CreateAnnouncement(c *gin.Context) {
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

	var req CreateAnnouncementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := h.service.CreateAnnouncement(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Announcement created successfully"})
}

// GetAnnouncements returns recent announcements
// GET /api/v1/announcements
func (h *Handler) GetAnnouncements(c *gin.Context) {
	announcements, err := h.service.GetAnnouncements(c.Request.Context(), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"announcements": announcements})
}
