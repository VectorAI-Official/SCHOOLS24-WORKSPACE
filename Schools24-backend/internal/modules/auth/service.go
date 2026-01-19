package auth

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/schools24/backend/internal/config"
	"github.com/schools24/backend/internal/shared/middleware"
	"golang.org/x/crypto/bcrypt"
)

// Service handles authentication business logic
type Service struct {
	repo   *Repository
	config *config.Config
}

// Common errors
var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrEmailExists        = errors.New("email already registered")
	ErrUserNotFound       = errors.New("user not found")
)

// NewService creates a new auth service
func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{
		repo:   repo,
		config: cfg,
	}
}

// Register creates a new user account
func (s *Service) Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error) {
	// Check if email exists
	exists, err := s.repo.EmailExists(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrEmailExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Role:         req.Role,
		FullName:     req.FullName,
	}
	if req.Phone != "" {
		user.Phone = &req.Phone
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	// Generate tokens
	return s.generateAuthResponse(user)
}

// Login authenticates a user and returns tokens
func (s *Service) Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error) {
	// Get user by email
	user, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Update last login
	_ = s.repo.UpdateLastLogin(ctx, user.ID)

	// Generate tokens
	return s.generateAuthResponse(user)
}

// GetMe returns the current user's profile
func (s *Service) GetMe(ctx context.Context, userID uuid.UUID) (*User, error) {
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

// UpdateProfile updates user profile
func (s *Service) UpdateProfile(ctx context.Context, userID uuid.UUID, req *UpdateProfileRequest) (*User, error) {
	return s.repo.UpdateProfile(ctx, userID, req)
}

// generateAuthResponse creates tokens and auth response
func (s *Service) generateAuthResponse(user *User) (*AuthResponse, error) {
	expiryHours := s.config.JWT.ExpirationHours
	expiry := time.Duration(expiryHours) * time.Hour

	claims := middleware.Claims{
		UserID:   user.ID.String(),
		Email:    user.Email,
		Role:     user.Role,
		SchoolID: "", // Will be populated when we add school support
	}

	accessToken, err := middleware.GenerateToken(s.config.JWT.Secret, claims, expiry)
	if err != nil {
		return nil, err
	}

	// Generate refresh token (longer expiry)
	refreshExpiry := time.Duration(s.config.JWT.RefreshExpirationDays) * 24 * time.Hour
	refreshToken, err := middleware.GenerateToken(s.config.JWT.Secret, claims, refreshExpiry)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiryHours * 3600, // In seconds
	}, nil
}
