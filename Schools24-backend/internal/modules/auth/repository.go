package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/schools24/backend/internal/shared/database"
)

// Repository handles database operations for auth
type Repository struct {
	db *database.PostgresDB
}

// NewRepository creates a new auth repository
func NewRepository(db *database.PostgresDB) *Repository {
	return &Repository{db: db}
}

// CreateUser creates a new user in the database
func (r *Repository) CreateUser(ctx context.Context, user *User) error {
	query := `
		INSERT INTO users (id, email, password_hash, role, full_name, phone, is_active, email_verified, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at, updated_at
	`

	now := time.Now()
	user.ID = uuid.New()
	user.IsActive = true
	user.EmailVerified = false
	user.CreatedAt = now
	user.UpdatedAt = now

	err := r.db.QueryRow(ctx, query,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.FullName,
		user.Phone,
		user.IsActive,
		user.EmailVerified,
		user.CreatedAt,
		user.UpdatedAt,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// GetUserByEmail retrieves a user by email
func (r *Repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	query := `
		SELECT id, email, password_hash, role, full_name, phone, profile_picture_url, 
		       is_active, email_verified, last_login_at, created_at, updated_at
		FROM users
		WHERE email = $1 AND is_active = true
	`

	var user User
	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.FullName,
		&user.Phone,
		&user.ProfilePictureURL,
		&user.IsActive,
		&user.EmailVerified,
		&user.LastLoginAt,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return &user, nil
}

// GetUserByID retrieves a user by ID
func (r *Repository) GetUserByID(ctx context.Context, id uuid.UUID) (*User, error) {
	query := `
		SELECT id, email, password_hash, role, full_name, phone, profile_picture_url, 
		       is_active, email_verified, last_login_at, created_at, updated_at
		FROM users
		WHERE id = $1 AND is_active = true
	`

	var user User
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.FullName,
		&user.Phone,
		&user.ProfilePictureURL,
		&user.IsActive,
		&user.EmailVerified,
		&user.LastLoginAt,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}

	return &user, nil
}

// UpdateLastLogin updates the last login timestamp
func (r *Repository) UpdateLastLogin(ctx context.Context, userID uuid.UUID) error {
	query := `UPDATE users SET last_login_at = $1, updated_at = $1 WHERE id = $2`
	return r.db.Exec(ctx, query, time.Now(), userID)
}

// UpdateProfile updates user profile fields
func (r *Repository) UpdateProfile(ctx context.Context, userID uuid.UUID, req *UpdateProfileRequest) (*User, error) {
	query := `
		UPDATE users 
		SET full_name = COALESCE($1, full_name),
		    phone = COALESCE($2, phone),
		    profile_picture_url = COALESCE($3, profile_picture_url),
		    updated_at = $4
		WHERE id = $5
		RETURNING id, email, password_hash, role, full_name, phone, profile_picture_url, 
		          is_active, email_verified, last_login_at, created_at, updated_at
	`

	var user User
	err := r.db.QueryRow(ctx, query,
		req.FullName,
		req.Phone,
		req.ProfilePictureURL,
		time.Now(),
		userID,
	).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.FullName,
		&user.Phone,
		&user.ProfilePictureURL,
		&user.IsActive,
		&user.EmailVerified,
		&user.LastLoginAt,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update profile: %w", err)
	}

	return &user, nil
}

// EmailExists checks if an email already exists
func (r *Repository) EmailExists(ctx context.Context, email string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, email).Scan(&exists)
	return exists, err
}
