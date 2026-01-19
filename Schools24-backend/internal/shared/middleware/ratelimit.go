package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// RateLimiter provides token bucket rate limiting per IP
type RateLimiter struct {
	mu       sync.RWMutex
	limiters map[string]*rate.Limiter
	rate     rate.Limit
	burst    int
	cleanup  time.Duration
}

// RateLimitConfig holds rate limiter configuration
type RateLimitConfig struct {
	RequestsPerSecond float64       // Requests allowed per second
	Burst             int           // Maximum burst size
	CleanupInterval   time.Duration // Cleanup interval for old limiters
}

// DefaultRateLimitConfig returns sensible defaults
func DefaultRateLimitConfig() RateLimitConfig {
	return RateLimitConfig{
		RequestsPerSecond: 100, // 100 req/sec per IP
		Burst:             20,
		CleanupInterval:   10 * time.Minute,
	}
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(cfg RateLimitConfig) *RateLimiter {
	rl := &RateLimiter{
		limiters: make(map[string]*rate.Limiter),
		rate:     rate.Limit(cfg.RequestsPerSecond),
		burst:    cfg.Burst,
		cleanup:  cfg.CleanupInterval,
	}

	// Start cleanup goroutine
	go rl.cleanupLoop()

	return rl
}

// getLimiter returns or creates a limiter for the given IP
func (rl *RateLimiter) getLimiter(ip string) *rate.Limiter {
	rl.mu.RLock()
	limiter, exists := rl.limiters[ip]
	rl.mu.RUnlock()

	if exists {
		return limiter
	}

	rl.mu.Lock()
	defer rl.mu.Unlock()

	// Double-check after acquiring write lock
	if limiter, exists = rl.limiters[ip]; exists {
		return limiter
	}

	limiter = rate.NewLimiter(rl.rate, rl.burst)
	rl.limiters[ip] = limiter
	return limiter
}

// cleanupLoop periodically removes old limiters
func (rl *RateLimiter) cleanupLoop() {
	ticker := time.NewTicker(rl.cleanup)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		// Simple cleanup: clear all limiters periodically
		// This is memory-efficient for low-traffic scenarios
		rl.limiters = make(map[string]*rate.Limiter)
		rl.mu.Unlock()
	}
}

// Middleware returns a Gin middleware for rate limiting
func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := rl.getLimiter(ip)

		if !limiter.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":   "rate_limit_exceeded",
				"message": "Too many requests. Please slow down.",
			})
			return
		}

		c.Next()
	}
}

// RateLimit is a convenience function for simple rate limiting
func RateLimit(requestsPerSecond float64, burst int) gin.HandlerFunc {
	rl := NewRateLimiter(RateLimitConfig{
		RequestsPerSecond: requestsPerSecond,
		Burst:             burst,
		CleanupInterval:   10 * time.Minute,
	})
	return rl.Middleware()
}
