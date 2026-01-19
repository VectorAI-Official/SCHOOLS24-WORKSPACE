package main

import (
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/schools24/backend/internal/config"
	"github.com/schools24/backend/internal/modules/academic"
	"github.com/schools24/backend/internal/modules/admin"
	"github.com/schools24/backend/internal/modules/auth"
	"github.com/schools24/backend/internal/modules/student"
	"github.com/schools24/backend/internal/modules/teacher"
	"github.com/schools24/backend/internal/shared/cache"
	"github.com/schools24/backend/internal/shared/database"
	"github.com/schools24/backend/internal/shared/middleware"
)

func main() {
	// 1. Load Configuration
	cfg := config.Load()

	log.Printf("Starting %s in %s mode", cfg.App.Name, cfg.App.Env)

	// 2. Set Gin Mode
	gin.SetMode(cfg.App.GinMode)

	// 3. Initialize In-Memory Cache
	cacheConfig := cache.DefaultConfig()
	appCache, err := cache.New(cacheConfig)
	if err != nil {
		log.Fatalf("Failed to initialize cache: %v", err)
	}
	defer appCache.Close()
	log.Printf("In-memory cache initialized (max %d MB)", cacheConfig.MaxSizeMB)

	// 4. Initialize PostgreSQL (Neon)
	db, err := database.NewPostgresDB(cfg.Database.URL)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	// 5. Run migrations (auto-create tables)
	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()

	if err := db.RunMigrations(ctx); err != nil {
		log.Fatalf("Failed to run auth migrations: %v", err)
	}
	if err := db.RunStudentMigrations(ctx); err != nil {
		log.Fatalf("Failed to run student migrations: %v", err)
	}
	if err := db.RunAcademicMigrations(ctx); err != nil {
		log.Fatalf("Failed to run academic migrations: %v", err)
	}
	if err := db.RunTeacherMigrations(ctx); err != nil {
		log.Fatalf("Failed to run teacher migrations: %v", err)
	}
	if err := db.RunAttendanceMigrations(ctx); err != nil {
		log.Fatalf("Failed to run attendance migrations: %v", err)
	}
	if err := db.RunAdminMigrations(ctx); err != nil {
		log.Fatalf("Failed to run admin migrations: %v", err)
	}

	// 6. Initialize MongoDB (optional, for quizzes/questions)
	mongoDB, err := database.NewMongoDB(cfg.MongoDB.URI, cfg.MongoDB.Database)
	if err != nil {
		log.Printf("Warning: MongoDB connection failed: %v (continuing without MongoDB)", err)
	} else {
		defer mongoDB.Close()
	}

	// 7. Initialize Modules
	// Auth Module
	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg)
	authHandler := auth.NewHandler(authService)

	// Student Module
	studentRepo := student.NewRepository(db)
	studentService := student.NewService(studentRepo, cfg)
	studentHandler := student.NewHandler(studentService)

	// Academic Module
	academicRepo := academic.NewRepository(db)
	academicService := academic.NewService(academicRepo, studentRepo, cfg)
	academicHandler := academic.NewHandler(academicService)

	// Teacher Module
	teacherRepo := teacher.NewRepository(db)
	teacherService := teacher.NewService(teacherRepo, cfg)
	teacherHandler := teacher.NewHandler(teacherService)

	// Admin Module
	adminRepo := admin.NewRepository(db)
	adminService := admin.NewService(adminRepo, cfg)
	adminHandler := admin.NewHandler(adminService)

	// 8. Initialize Gin Router
	r := gin.New()
	r.Use(gin.Recovery())

	if cfg.App.Env == "development" {
		r.Use(gin.Logger())
	}

	// CORS middleware
	r.Use(middleware.CORSFromEnv(
		cfg.CORS.AllowedOrigins,
		cfg.CORS.AllowedMethods,
		cfg.CORS.AllowedHeaders,
	))

	// Rate limiting
	r.Use(middleware.RateLimit(
		float64(cfg.RateLimit.RequestsPerMin)/60,
		cfg.RateLimit.Burst,
	))

	// 9. Register Routes

	// Health checks
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": cfg.App.Name,
		})
	})

	r.GET("/ready", func(c *gin.Context) {
		c.JSON(200, gin.H{"ready": true})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")

	// Static files (uploads)
	r.Static("/uploads", "./uploads")

	// Auth routes (public)
	authPublic := v1.Group("/auth")
	{
		authPublic.POST("/login", authHandler.Login)
		authPublic.POST("/register", authHandler.Register)
	}

	// Protected routes (require JWT)
	protected := v1.Group("")
	protected.Use(middleware.JWTAuth(middleware.DefaultJWTConfig(cfg.JWT.Secret)))
	{
		// Auth protected routes
		protected.GET("/auth/me", authHandler.GetMe)
		protected.PUT("/auth/me", authHandler.UpdateProfile)
		protected.POST("/auth/logout", authHandler.Logout)

		// Student routes
		studentRoutes := protected.Group("/student")
		{
			studentRoutes.GET("/dashboard", studentHandler.GetDashboard)
			studentRoutes.GET("/profile", studentHandler.GetProfile)
			studentRoutes.GET("/attendance", studentHandler.GetAttendance)
		}

		// Academic routes
		academicRoutes := protected.Group("/academic")
		{
			academicRoutes.GET("/timetable", academicHandler.GetTimetable)
			academicRoutes.GET("/homework", academicHandler.GetHomework)
			academicRoutes.GET("/homework/:id", academicHandler.GetHomeworkByID)
			academicRoutes.POST("/homework/:id/submit", academicHandler.SubmitHomework)
			academicRoutes.GET("/grades", academicHandler.GetGrades)
			academicRoutes.GET("/subjects", academicHandler.GetSubjects)
			academicRoutes.POST("/subjects", middleware.RequireRole("admin"), academicHandler.CreateSubject)
		}

		// Teacher routes
		teacherRoutes := protected.Group("/teacher")
		teacherRoutes.Use(middleware.RequireRole("teacher", "admin"))
		{
			teacherRoutes.GET("/dashboard", teacherHandler.GetDashboard)
			teacherRoutes.GET("/profile", teacherHandler.GetProfile)
			teacherRoutes.GET("/classes", teacherHandler.GetClasses)
			teacherRoutes.GET("/classes/:classId/students", teacherHandler.GetClassStudents)
			teacherRoutes.POST("/attendance", teacherHandler.MarkAttendance)
			teacherRoutes.POST("/homework", teacherHandler.CreateHomework)
			teacherRoutes.POST("/grades", teacherHandler.EnterGrade)
			teacherRoutes.POST("/announcements", teacherHandler.CreateAnnouncement)
		}

		// Announcements (all authenticated users can view)
		protected.GET("/announcements", teacherHandler.GetAnnouncements)

		// Admin routes
		adminRoutes := protected.Group("/admin")
		adminRoutes.Use(middleware.RequireRole("admin"))
		{
			adminRoutes.GET("/dashboard", adminHandler.GetDashboard)
			adminRoutes.GET("/users", adminHandler.GetUsers)
			adminRoutes.GET("/users/:id", adminHandler.GetUser)
			adminRoutes.POST("/users", adminHandler.CreateUser)
			adminRoutes.PUT("/users/:id", adminHandler.UpdateUser)
			adminRoutes.DELETE("/users/:id", adminHandler.DeleteUser)
			adminRoutes.POST("/students", adminHandler.CreateStudent)
			adminRoutes.POST("/teachers", adminHandler.CreateTeacher)
			adminRoutes.GET("/fees/structures", adminHandler.GetFeeStructures)
			adminRoutes.POST("/fees/structures", adminHandler.CreateFeeStructure)
			adminRoutes.POST("/payments", adminHandler.RecordPayment)
			adminRoutes.GET("/payments", adminHandler.GetPayments)
			adminRoutes.GET("/audit-logs", adminHandler.GetAuditLogs)
		}

		// Classes routes (shared)
		protected.GET("/classes", studentHandler.GetClasses)
		protected.POST("/classes", middleware.RequireRole("admin"), studentHandler.CreateClass)
	}

	// 10. Start Server
	port := cfg.App.Port
	log.Printf("Server starting on port %s", port)
	log.Printf("Health: http://localhost:%s/health", port)
	log.Printf("Auth: http://localhost:%s/api/v1/auth/login", port)
	log.Printf("Student: http://localhost:%s/api/v1/student/dashboard", port)
	log.Printf("Teacher: http://localhost:%s/api/v1/teacher/dashboard", port)
	log.Printf("Admin: http://localhost:%s/api/v1/admin/dashboard", port)
	log.Printf("Academic: http://localhost:%s/api/v1/academic/timetable", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
