# 🗺️ Schools24 Backend Implementation Roadmap

## Executive Summary

This roadmap provides a **step-by-step implementation plan** for building the complete Schools24 backend infrastructure, from database setup to Kubernetes deployment. The plan is divided into 8 phases spanning **12-16 weeks** for a complete production-ready system.

---

## 📋 Implementation Overview

```
Phase 1: Foundation Setup (Week 1-2)
├── Database schema implementation
├── Development environment setup
└── Basic Go project structure

Phase 2: Core Services Development (Week 3-5)
├── Authentication & Authorization
├── User Management Service
└── Session Management with Redis

Phase 3: Academic Services (Week 6-8)
├── Quiz & Exam Services
├── Homework Service
├── Attendance & Grading Services
└── Dashboard Services

Phase 4: Financial & Operational Services (Week 9-10)
├── Fee Management
├── Payment Integration
├── Inventory & Bus Route Services
└── Calendar & Event Management

Phase 5: Advanced Features (Week 11-12)
├── Notification Service (Email, SMS, Push)
├── Analytics & Reporting
├── Batch Processor (Redis-to-DB sync)
└── Monitoring Service

Phase 6: Containerization & Kubernetes (Week 13-14)
├── Docker images for all services
├── Kubernetes manifests
├── Helm charts
└── Local K8s testing (Minikube/Kind)

Phase 7: Production Deployment (Week 15)
├── AWS EKS cluster setup
├── Service deployment
├── Istio service mesh
└── Monitoring stack (Prometheus, Grafana, ELK)

Phase 8: Testing & Optimization (Week 16)
├── Load testing
├── Performance tuning
├── Security hardening
└── Documentation finalization
```

---

## 🚀 Phase 1: Foundation Setup (Week 1-2)

### Week 1: Database Infrastructure

#### Day 1-2: PostgreSQL Setup

**Tasks:**
1. Install PostgreSQL 16 locally (or use Docker)
2. Create database and application user
3. Run initial schema migration

**Commands:**
```bash
# Using Docker
docker run --name schools24-postgres \
  -e POSTGRES_DB=schools24_db \
  -e POSTGRES_USER=schools24_app \
  -e POSTGRES_PASSWORD=dev_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:16-alpine

# Connect and verify
docker exec -it schools24-postgres psql -U schools24_app -d schools24_db

# Create tables (run from migrations file)
psql -U schools24_app -d schools24_db -f migrations/001_initial_schema.sql
```

**SQL Migration File** (`migrations/001_initial_schema.sql`):
```sql
-- Create users table
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Continue with all tables from DATABASE_SCHEMA_DESIGN.md
-- (Teachers, students, classes, subjects, etc.)
```

---

#### Day 3-4: MongoDB Setup

**Commands:**
```bash
# Using Docker
docker run --name schools24-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=dev_password \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  -d mongo:7.0

# Connect and create database
docker exec -it schools24-mongo mongosh

# In MongoDB shell
use schools24_mongodb

db.createUser({
  user: "schools24_app",
  pwd: "dev_password",
  roles: [{ role: "readWrite", db: "schools24_mongodb" }]
})

# Create collections with schema validation
db.createCollection("questions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["quiz_id", "question_text", "correct_answer"],
      properties: {
        quiz_id: { bsonType: "string" },
        question_text: { bsonType: "string" },
        options: { bsonType: "array" },
        correct_answer: { bsonType: "int" },
        difficulty: { enum: ["easy", "medium", "hard"] }
      }
    }
  }
})

# Create indexes
db.questions.createIndex({ quiz_id: 1 })
db.questions.createIndex({ "question_text": "text" })
```

---

#### Day 5: Redis Setup

**Commands:**
```bash
# Using Docker
docker run --name schools24-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  -d redis:7.2-alpine \
  redis-server --requirepass dev_password --appendonly yes

# Test connection
docker exec -it schools24-redis redis-cli
AUTH dev_password
PING  # Should return PONG

# Test compression (manual test)
SET test_key "sample_data"
GET test_key
```

---

#### Day 6-7: Go Project Structure

**Create Project Structure:**
```bash
mkdir -p schools24-backend
cd schools24-backend

# Initialize Go module
go mod init github.com/yourusername/schools24-backend

# Create directory structure
mkdir -p cmd/server
mkdir -p internal/{repository,service,handler,middleware,domain,worker}
mkdir -p internal/repository/{postgres,mongo,redis}
mkdir -p internal/service/{auth,dashboard,quiz,homework,fee,notification}
mkdir -p config
mkdir -p migrations
mkdir -p k8s/{deployments,services,configmaps,secrets,hpa}
mkdir -p docs
mkdir -p scripts

# Create main.go
cat > cmd/server/main.go <<'EOF'
package main

import (
    "log"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status": "healthy",
            "service": "schools24-backend",
        })
    })
    
    log.Println("Server starting on :8080")
    r.Run(":8080")
}
EOF
```

---

**Install Dependencies:**
```bash
# Core dependencies
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get go.mongodb.org/mongo-driver/mongo
go get github.com/go-redis/redis/v8
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt

# Compression
go get github.com/golang/snappy
go get github.com/pierrec/lz4/v4

# Utilities
go get github.com/google/uuid
go get github.com/robfig/cron/v3
go get github.com/joho/godotenv
go get github.com/spf13/viper

# AWS SDK (for S3)
go get github.com/aws/aws-sdk-go-v2/service/s3
go get github.com/aws/aws-sdk-go-v2/config

# Testing
go get github.com/stretchr/testify

# Swagger documentation
go get github.com/swaggo/swag/cmd/swag
go get github.com/swaggo/gin-swagger
```

---

**Create Configuration File** (`.env`):
```bash
cat > .env <<'EOF'
# Server
PORT=8080
GIN_MODE=debug

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=schools24_app
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=schools24_db
POSTGRES_MAX_CONNECTIONS=100
POSTGRES_IDLE_CONNECTIONS=10

# MongoDB
MONGODB_URI=mongodb://schools24_app:dev_password@localhost:27017/schools24_mongodb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=dev_password
REDIS_DB=0
REDIS_POOL_SIZE=100

# Redis Caching
REDIS_COMPRESSION_ENABLED=true
REDIS_COMPRESSION_ALGORITHM=snappy
REDIS_DEFAULT_TTL=3600
REDIS_WRITE_BUFFER_TTL=7200

# Batch Processor
BATCH_PROCESSOR_ENABLED=true
BATCH_PROCESSOR_INTERVAL=3600
BATCH_PROCESSOR_PARALLEL_WORKERS=10

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-prod
JWT_EXPIRY_HOURS=24

# AWS S3
AWS_REGION=us-east-1
AWS_S3_BUCKET=schools24-files
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# External APIs
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
EOF
```

---

**Week 1 Deliverables:**
- ✅ PostgreSQL database running with initial schema
- ✅ MongoDB running with collections and indexes
- ✅ Redis running with persistence enabled
- ✅ Go project structure created
- ✅ All dependencies installed
- ✅ Configuration file set up

---

### Week 2: Core Infrastructure Code

#### Day 8-9: Database Connection Managers

**PostgreSQL Repository** (`internal/repository/postgres/db.go`):
```go
package postgres

import (
    "fmt"
    "log"
    "os"
    "time"
    
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

type PostgresDB struct {
    DB *gorm.DB
}

func NewPostgresDB() (*PostgresDB, error) {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        os.Getenv("POSTGRES_HOST"),
        os.Getenv("POSTGRES_USER"),
        os.Getenv("POSTGRES_PASSWORD"),
        os.Getenv("POSTGRES_DB"),
        os.Getenv("POSTGRES_PORT"),
    )
    
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })
    if err != nil {
        return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
    }
    
    sqlDB, err := db.DB()
    if err != nil {
        return nil, err
    }
    
    sqlDB.SetMaxOpenConns(100)
    sqlDB.SetMaxIdleConns(10)
    sqlDB.SetConnMaxLifetime(time.Hour)
    
    log.Println("PostgreSQL connection established")
    return &PostgresDB{DB: db}, nil
}
```

---

**MongoDB Repository** (`internal/repository/mongo/db.go`):
```go
package mongo

import (
    "context"
    "log"
    "os"
    "time"
    
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDB struct {
    Client *mongo.Client
    DB     *mongo.Database
}

func NewMongoDB() (*MongoDB, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    clientOptions := options.Client().
        ApplyURI(os.Getenv("MONGODB_URI")).
        SetMaxPoolSize(100)
    
    client, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        return nil, err
    }
    
    if err := client.Ping(ctx, nil); err != nil {
        return nil, err
    }
    
    db := client.Database("schools24_mongodb")
    log.Println("MongoDB connection established")
    
    return &MongoDB{
        Client: client,
        DB:     db,
    }, nil
}

func (m *MongoDB) GetCollection(name string) *mongo.Collection {
    return m.DB.Collection(name)
}
```

---

**Redis Cache Service** (`internal/repository/redis/cache_service.go`):
```go
package redis

import (
    "context"
    "encoding/json"
    "fmt"
    "time"
    
    "github.com/go-redis/redis/v8"
    "github.com/golang/snappy"
)

type CacheService struct {
    client *redis.Client
    ctx    context.Context
}

func NewCacheService() (*CacheService, error) {
    client := redis.NewClient(&redis.Options{
        Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
        Password: os.Getenv("REDIS_PASSWORD"),
        DB:       0,
        PoolSize: 100,
    })
    
    ctx := context.Background()
    if err := client.Ping(ctx).Err(); err != nil {
        return nil, err
    }
    
    log.Println("Redis connection established")
    return &CacheService{
        client: client,
        ctx:    ctx,
    }, nil
}

// CompressAndStore compresses data with Snappy and stores in Redis
func (cs *CacheService) CompressAndStore(key string, data interface{}, ttl time.Duration) error {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return err
    }
    
    compressed := snappy.Encode(nil, jsonData)
    
    if err := cs.client.Set(cs.ctx, key, compressed, ttl).Err(); err != nil {
        return err
    }
    
    // Store metadata
    metadata := map[string]interface{}{
        "compressed":      true,
        "original_size":   len(jsonData),
        "compressed_size": len(compressed),
        "timestamp":       time.Now().Unix(),
        "synced_to_db":    false,
    }
    cs.client.HMSet(cs.ctx, "meta:"+key, metadata)
    
    return nil
}

// FetchAndDecompress retrieves and decompresses data from Redis
func (cs *CacheService) FetchAndDecompress(key string, result interface{}) (bool, error) {
    compressed, err := cs.client.Get(cs.ctx, key).Bytes()
    if err == redis.Nil {
        return false, nil // Cache miss
    }
    if err != nil {
        return false, err
    }
    
    decompressed, err := snappy.Decode(nil, compressed)
    if err != nil {
        return false, err
    }
    
    if err := json.Unmarshal(decompressed, result); err != nil {
        return false, err
    }
    
    return true, nil // Cache hit
}

// GetUnsyncedKeys returns keys that haven't been synced to database
func (cs *CacheService) GetUnsyncedKeys(pattern string) ([]string, error) {
    keys, err := cs.client.Keys(cs.ctx, pattern).Result()
    if err != nil {
        return nil, err
    }
    
    var unsyncedKeys []string
    for _, key := range keys {
        synced, _ := cs.client.HGet(cs.ctx, "meta:"+key, "synced_to_db").Bool()
        if !synced {
            unsyncedKeys = append(unsyncedKeys, key)
        }
    }
    
    return unsyncedKeys, nil
}

// FlushSyncedKey deletes key and metadata after DB sync
func (cs *CacheService) FlushSyncedKey(key string) error {
    pipe := cs.client.Pipeline()
    pipe.Del(cs.ctx, key)
    pipe.Del(cs.ctx, "meta:"+key)
    _, err := pipe.Exec(cs.ctx)
    return err
}
```

---

#### Day 10-11: Domain Models

**User Domain Model** (`internal/domain/user.go`):
```go
package domain

import (
    "time"
    "github.com/google/uuid"
)

type User struct {
    ID                uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
    Email             string     `gorm:"unique;not null" json:"email"`
    PasswordHash      string     `gorm:"not null" json:"-"`
    Role              string     `gorm:"not null" json:"role"` // admin, teacher, student, staff
    FullName          string     `gorm:"not null" json:"full_name"`
    Phone             string     `json:"phone"`
    ProfilePictureURL string     `json:"profile_picture_url"`
    IsActive          bool       `gorm:"default:true" json:"is_active"`
    EmailVerified     bool       `gorm:"default:false" json:"email_verified"`
    LastLoginAt       *time.Time `json:"last_login_at"`
    CreatedAt         time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
    UpdatedAt         time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (User) TableName() string {
    return "users"
}

type Student struct {
    ID              uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
    UserID          uuid.UUID  `gorm:"unique;not null" json:"user_id"`
    User            User       `gorm:"foreignKey:UserID" json:"user"`
    AdmissionNumber string     `gorm:"unique;not null" json:"admission_number"`
    RollNumber      string     `json:"roll_number"`
    ClassID         *uuid.UUID `json:"class_id"`
    Section         string     `json:"section"`
    DateOfBirth     time.Time  `json:"date_of_birth"`
    Gender          string     `json:"gender"`
    BloodGroup      string     `json:"blood_group"`
    Address         string     `json:"address"`
    ParentName      string     `json:"parent_name"`
    ParentEmail     string     `json:"parent_email"`
    ParentPhone     string     `json:"parent_phone"`
    EmergencyContact string    `json:"emergency_contact"`
    AdmissionDate   time.Time  `json:"admission_date"`
    AcademicYear    string     `json:"academic_year"`
    CreatedAt       time.Time  `json:"created_at"`
    UpdatedAt       time.Time  `json:"updated_at"`
}

// Continue with Teacher, Class, Homework, Quiz models...
```

---

#### Day 12-14: Authentication Service

**Auth Service** (`internal/service/auth/auth_service.go`):
```go
package auth

import (
    "errors"
    "time"
    
    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "github.com/yourusername/schools24-backend/internal/domain"
    "github.com/yourusername/schools24-backend/internal/repository/postgres"
    "github.com/yourusername/schools24-backend/internal/repository/redis"
)

type AuthService struct {
    db    *postgres.PostgresDB
    cache *redis.CacheService
}

func NewAuthService(db *postgres.PostgresDB, cache *redis.CacheService) *AuthService {
    return &AuthService{db: db, cache: cache}
}

type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
    Token string      `json:"token"`
    User  domain.User `json:"user"`
}

func (s *AuthService) Login(req LoginRequest) (*LoginResponse, error) {
    var user domain.User
    result := s.db.DB.Where("email = ?", req.Email).First(&user)
    if result.Error != nil {
        return nil, errors.New("invalid credentials")
    }
    
    if !user.IsActive {
        return nil, errors.New("account is deactivated")
    }
    
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
        return nil, errors.New("invalid credentials")
    }
    
    // Generate JWT token
    token, err := s.generateToken(user)
    if err != nil {
        return nil, err
    }
    
    // Update last login
    now := time.Now()
    user.LastLoginAt = &now
    s.db.DB.Save(&user)
    
    // Cache session in Redis
    sessionKey := "session:" + token
    s.cache.CompressAndStore(sessionKey, user, 24*time.Hour)
    
    return &LoginResponse{
        Token: token,
        User:  user,
    }, nil
}

func (s *AuthService) generateToken(user domain.User) (string, error) {
    claims := jwt.MapClaims{
        "user_id": user.ID.String(),
        "email":   user.Email,
        "role":    user.Role,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    }
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
```

---

**Week 2 Deliverables:**
- ✅ Database connection managers (PostgreSQL, MongoDB, Redis)
- ✅ Redis compression service with Snappy
- ✅ Domain models for users, students, teachers
- ✅ Authentication service with JWT
- ✅ Password hashing with bcrypt

---

## 📊 Progress Tracking Template

```markdown
## Implementation Checklist

### Phase 1: Foundation ✅
- [x] PostgreSQL setup
- [x] MongoDB setup
- [x] Redis setup
- [x] Go project structure
- [x] Database connection managers
- [ ] Unit tests for infrastructure

### Phase 2: Core Services (In Progress)
- [x] Auth Service
- [ ] User Management Service
- [ ] Session Management
- [ ] API Gateway setup

### Phase 3: Academic Services
- [ ] Quiz Service
- [ ] Exam Service
- [ ] Homework Service
- [ ] Attendance Service
- [ ] Grading Service
- [ ] Dashboard Service

### Phase 4: Financial Services
- [ ] Fee Service
- [ ] Payment Integration (Razorpay/Stripe)
- [ ] Invoice Generation
- [ ] Receipt Management

### Phase 5: Operational Services
- [ ] Inventory Service
- [ ] Bus Route Service
- [ ] Calendar Service
- [ ] Notification Service (Email/SMS/Push)

### Phase 6: Advanced Features
- [ ] Analytics Service
- [ ] Report Generation (PDF)
- [ ] Batch Processor (1-hour sync)
- [ ] Monitoring Service

### Phase 7: Containerization
- [ ] Dockerfiles for all services
- [ ] Kubernetes manifests
- [ ] Helm charts
- [ ] CI/CD pipeline

### Phase 8: Production
- [ ] EKS cluster setup
- [ ] Service deployment
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Load testing
- [ ] Security audit
```

---

## 🎯 Next Steps for You

Based on your request to "start with DB schema design first," here's what you should do now:

### Immediate Actions:

1. **Review the documents I created:**
   - ✅ `DATABASE_SCHEMA_DESIGN.md` - Complete PostgreSQL + MongoDB + Redis schemas
   - ✅ `KUBERNETES_ARCHITECTURE.md` - K8s deployment with nodal hosting
   - ✅ `IMPLEMENTATION_ROADMAP.md` - This step-by-step guide

2. **Set up your development environment (Week 1):**
   ```bash
   # Clone/create your backend repo
   git clone <your-repo> schools24-backend
   cd schools24-backend
   
   # Run databases with Docker Compose
   docker-compose up -d
   
   # Initialize Go project
   go mod init github.com/yourusername/schools24-backend
   
   # Install dependencies
   go get github.com/gin-gonic/gin
   # ... (see Week 1 dependency list)
   ```

3. **Start implementing Phase 1 (this week):**
   - Create database migration files
   - Set up PostgreSQL tables
   - Configure MongoDB collections
   - Test Redis caching

4. **Parallel frontend development:**
   - Your team can continue building the frontend using the mock data
   - Once backend is ready, swap mock API calls with real endpoints

---

## 📞 Support & Questions

If you have questions during implementation:

**Architecture Questions:**
- Refer to `SCHOOLS24_PRODUCTION_ARCHITECTURE copy-main.md` for high-level design
- `REDIS_ARCHITECTURE_DIAGRAMS.md` for caching strategy

**Database Questions:**
- `DATABASE_SCHEMA_DESIGN.md` has complete schemas, indexes, sample data

**Kubernetes Questions:**
- `KUBERNETES_ARCHITECTURE.md` has pod specs, node distribution, failover strategies

**Implementation Questions:**
- This roadmap provides week-by-week code examples
- Each phase has detailed code snippets

---

**Estimated Timeline:**
- **Database Setup**: 2 weeks ✅ (You're starting here)
- **Backend Development**: 10 weeks
- **Kubernetes Deployment**: 2 weeks
- **Testing & Go-Live**: 2 weeks
- **Total**: 16 weeks to production

**Team Size Recommendation:**
- 2-3 backend developers
- 1 DevOps engineer (for K8s)
- 1 QA engineer

Let me know which phase you'd like detailed code examples for, and I'll provide complete implementation files! 🚀
