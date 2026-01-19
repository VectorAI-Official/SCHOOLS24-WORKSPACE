package auth

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	ID                uuid.UUID  `json:"id" db:"id"`
	Email             string     `json:"email" db:"email"`
	PasswordHash      string     `json:"-" db:"password_hash"`
	Role              string     `json:"role" db:"role"`
	FullName          string     `json:"full_name" db:"full_name"`
	Phone             *string    `json:"phone,omitempty" db:"phone"`
	ProfilePictureURL *string    `json:"profile_picture_url,omitempty" db:"profile_picture_url"`
	IsActive          bool       `json:"is_active" db:"is_active"`
	EmailVerified     bool       `json:"email_verified" db:"email_verified"`
	LastLoginAt       *time.Time `json:"last_login_at,omitempty" db:"last_login_at"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at" db:"updated_at"`
}

// UserRole constants
const (
	RoleAdmin   = "admin"
	RoleTeacher = "teacher"
	RoleStudent = "student"
	RoleStaff   = "staff"
	RoleParent  = "parent"
)

// LoginRequest represents login credentials
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// RegisterRequest represents registration data
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required,min=2"`
	Role     string `json:"role" binding:"required,oneof=admin teacher student staff parent"`
	Phone    string `json:"phone,omitempty"`
}

// AuthResponse represents successful auth response
type AuthResponse struct {
	User         *User  `json:"user"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token,omitempty"`
	ExpiresIn    int    `json:"expires_in"`
}

// PasswordResetRequest represents password reset request
type PasswordResetRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// UpdateProfileRequest represents profile update
type UpdateProfileRequest struct {
	FullName          *string `json:"full_name,omitempty"`
	Phone             *string `json:"phone,omitempty"`
	ProfilePictureURL *string `json:"profile_picture_url,omitempty"`
}
