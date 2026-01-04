# Schools24 Backend - Development Guidelines

## Architecture Overview
- **API Gateway**: KrakenD CE (handles North-South traffic)
- **Service Mesh**: Istio (handles East-West traffic with mTLS)
- **Backend**: Single Go service with modular packages
- **Orchestration**: Kubernetes

## Project Structure
```
schools24-backend/
├── cmd/server/main.go        # Single entry point
├── internal/
│   ├── config/               # Environment configuration
│   ├── modules/              # Feature modules
│   │   ├── auth/             # Authentication & JWT
│   │   ├── academic/         # Quizzes, Homework, Grades
│   │   ├── finance/          # Fees, Payments
│   │   ├── notification/     # Email, SMS, Push
│   │   └── operations/       # Bus routes, Inventory
│   ├── shared/               # Cross-cutting concerns
│   │   ├── cache/            # Redis (Snappy compression)
│   │   ├── database/         # PostgreSQL, MongoDB
│   │   └── middleware/       # Auth, logging, rate-limit
│   └── router/               # Route registration
├── krakend/krakend.json      # KrakenD configuration
├── deployments/
│   ├── docker/               # Dockerfiles
│   └── kubernetes/           # K8s + Istio manifests
└── .env, .env.example
```

## Coding Standards

### Go Conventions
- Use `internal/` for private packages
- One module = one domain (auth, academic, finance)
- Shared infrastructure in `internal/shared/`
- All handlers receive `*gin.Context`

### Module Structure
```go
internal/modules/<module>/
├── handler.go    // HTTP handlers
├── service.go    // Business logic
├── repository.go // Data access
├── models.go     // Domain models
└── routes.go     // Route registration
```

### Naming
- Files: `snake_case.go`
- Packages: `lowercase`
- Exported: `PascalCase`
- Private: `camelCase`

## KrakenD Configuration
- Config file: `krakend/krakend.json`
- All external routes go through KrakenD
- Backend listens on internal port 8081
- KrakenD handles: JWT validation, rate limiting, caching

## Database Strategy
- **PostgreSQL**: Relational data (users, fees, grades)
- **MongoDB**: Document data (questions, logs)
- **Redis**: Cache + session store (Snappy compressed)

## Memory Optimization
- Single binary deployment
- Shared connection pools
- Lazy module initialization
- Minimal dependencies
