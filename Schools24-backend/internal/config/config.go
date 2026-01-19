package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	App       AppConfig
	Database  DatabaseConfig
	MongoDB   MongoDBConfig
	Redis     RedisConfig
	JWT       JWTConfig
	AWS       AWSConfig
	Razorpay  RazorpayConfig
	Email     EmailConfig
	SMS       SMSConfig
	FCM       FCMConfig
	Logging   LoggingConfig
	RateLimit RateLimitConfig
	CORS      CORSConfig
	Features  FeatureFlags
}

type AppConfig struct {
	Env     string
	Name    string
	Port    string
	GinMode string
}

type DatabaseConfig struct {
	URL string // Neon PostgreSQL connection string
}

type MongoDBConfig struct {
	URI      string
	Database string
}

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
	PoolSize int
}

type JWTConfig struct {
	Secret                string
	ExpirationHours       int
	RefreshExpirationDays int
}

type AWSConfig struct {
	Region          string
	AccessKeyID     string
	SecretAccessKey string
	S3BucketName    string
	S3Endpoint      string
}

type RazorpayConfig struct {
	KeyID         string
	KeySecret     string
	WebhookSecret string
}

type EmailConfig struct {
	SendGridAPIKey string
	FromEmail      string
	FromName       string
}

type SMSConfig struct {
	TwilioAccountSID string
	TwilioAuthToken  string
	TwilioFromPhone  string
}

type FCMConfig struct {
	ServerKey string
	ProjectID string
}

type LoggingConfig struct {
	Level     string
	SentryDSN string
}

type RateLimitConfig struct {
	RequestsPerMin int
	Burst          int
}

type CORSConfig struct {
	AllowedOrigins string
	AllowedMethods string
	AllowedHeaders string
}

type FeatureFlags struct {
	QuestionPaperManagement bool
	LiveClasses             bool
	PaymentEnabled          bool
}

// Load reads environment variables and returns a Config struct
func Load() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return &Config{
		App: AppConfig{
			Env:     getEnv("APP_ENV", "development"),
			Name:    getEnv("APP_NAME", "schools24-backend"),
			Port:    getEnv("SERVER_PORT", "8080"),
			GinMode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			URL: getEnv("DATABASE_URL", ""),
		},
		MongoDB: MongoDBConfig{
			URI:      getEnv("MONGODB_URI", "mongodb://localhost:27017"),
			Database: getEnv("MONGODB_DATABASE", "schools24_mongodb"),
		},
		Redis: RedisConfig{
			Addr:     getEnv("REDIS_ADDR", "localhost:6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
			PoolSize: getEnvAsInt("REDIS_POOL_SIZE", 10),
		},
		JWT: JWTConfig{
			Secret:                getEnv("JWT_SECRET", "default_jwt_secret_change_me"),
			ExpirationHours:       getEnvAsInt("JWT_EXPIRATION_HOURS", 24),
			RefreshExpirationDays: getEnvAsInt("JWT_REFRESH_EXPIRATION_DAYS", 7),
		},
		AWS: AWSConfig{
			Region:          getEnv("AWS_REGION", "ap-south-1"),
			AccessKeyID:     getEnv("AWS_ACCESS_KEY_ID", ""),
			SecretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY", ""),
			S3BucketName:    getEnv("S3_BUCKET_NAME", "schools24-files"),
			S3Endpoint:      getEnv("S3_ENDPOINT", ""),
		},
		Razorpay: RazorpayConfig{
			KeyID:         getEnv("RAZORPAY_KEY_ID", ""),
			KeySecret:     getEnv("RAZORPAY_KEY_SECRET", ""),
			WebhookSecret: getEnv("RAZORPAY_WEBHOOK_SECRET", ""),
		},
		Email: EmailConfig{
			SendGridAPIKey: getEnv("SENDGRID_API_KEY", ""),
			FromEmail:      getEnv("SENDGRID_FROM_EMAIL", "noreply@schools24.com"),
			FromName:       getEnv("SENDGRID_FROM_NAME", "Schools24"),
		},
		SMS: SMSConfig{
			TwilioAccountSID: getEnv("TWILIO_ACCOUNT_SID", ""),
			TwilioAuthToken:  getEnv("TWILIO_AUTH_TOKEN", ""),
			TwilioFromPhone:  getEnv("TWILIO_FROM_PHONE", ""),
		},
		FCM: FCMConfig{
			ServerKey: getEnv("FCM_SERVER_KEY", ""),
			ProjectID: getEnv("FCM_PROJECT_ID", ""),
		},
		Logging: LoggingConfig{
			Level:     getEnv("LOG_LEVEL", "debug"),
			SentryDSN: getEnv("SENTRY_DSN", ""),
		},
		RateLimit: RateLimitConfig{
			RequestsPerMin: getEnvAsInt("RATE_LIMIT_REQUESTS_PER_MIN", 100),
			Burst:          getEnvAsInt("RATE_LIMIT_BURST", 20),
		},
		CORS: CORSConfig{
			AllowedOrigins: getEnv("CORS_ALLOWED_ORIGINS", "*"),
			AllowedMethods: getEnv("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS"),
			AllowedHeaders: getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization"),
		},
		Features: FeatureFlags{
			QuestionPaperManagement: getEnvAsBool("FEATURE_QUESTION_PAPER_MANAGEMENT", true),
			LiveClasses:             getEnvAsBool("FEATURE_LIVE_CLASSES", false),
			PaymentEnabled:          getEnvAsBool("FEATURE_PAYMENT_ENABLED", false),
		},
	}
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultValue
}
