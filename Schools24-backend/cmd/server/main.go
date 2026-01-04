package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/schools24/backend/internal/config"
	"github.com/schools24/backend/internal/router"
	"github.com/schools24/backend/internal/shared/cache"
)

func main() {
	// 1. Load Configuration
	cfg := config.Load()

	log.Printf("Starting %s in %s mode", cfg.App.Name, cfg.App.Env)

	// 2. Set Gin Mode
	gin.SetMode(cfg.App.GinMode)

	// 3. Initialize Shared Infrastructure
	// Redis Cache (with Snappy compression)
	redisClient, err := cache.NewRedisClient(cfg.Redis.Addr, cfg.Redis.Password, cfg.Redis.DB)
	if err != nil {
		log.Fatalf("Failed to initialize Redis: %v", err)
	}
	defer redisClient.Close()
	log.Println("Connected to Redis at", cfg.Redis.Addr)

	// 4. Initialize Gin Router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// 5. Register All Module Routes
	router.RegisterRoutes(r, &router.Dependencies{
		Config: cfg,
		Cache:  redisClient,
	})

	// 6. Start HTTP Server (internal port for KrakenD)
	internalPort := "8081" // KrakenD routes to this port
	log.Printf("Starting backend service on internal port %s", internalPort)
	if err := r.Run(":" + internalPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
