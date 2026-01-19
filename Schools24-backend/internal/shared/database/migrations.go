package database

import (
	"context"
	"log"
	"time"
)

// RunMigrations creates all required tables
func (db *PostgresDB) RunMigrations(ctx context.Context) error {
	log.Println("Running database migrations...")

	// Users table
	usersTable := `
		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'staff', 'parent')),
			full_name VARCHAR(255) NOT NULL,
			phone VARCHAR(20),
			profile_picture_url TEXT,
			is_active BOOLEAN DEFAULT true,
			email_verified BOOLEAN DEFAULT false,
			last_login_at TIMESTAMP,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
		CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
		CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
	`

	if err := db.Exec(ctx, usersTable); err != nil {
		return err
	}
	log.Println("✓ users table ready")

	// Password resets table
	passwordResetsTable := `
		CREATE TABLE IF NOT EXISTS password_resets (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			token VARCHAR(255) UNIQUE NOT NULL,
			expires_at TIMESTAMP NOT NULL,
			used BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
		CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
	`

	if err := db.Exec(ctx, passwordResetsTable); err != nil {
		return err
	}
	log.Println("✓ password_resets table ready")

	log.Println("All migrations completed successfully!")
	return nil
}

// RunMigrationsWithTimeout runs migrations with a timeout
func (db *PostgresDB) RunMigrationsWithTimeout() error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	return db.RunMigrations(ctx)
}
