package middleware

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTConfig holds JWT middleware configuration
type JWTConfig struct {
	Secret        string
	TokenLookup   string // "header:Authorization" or "query:token"
	TokenHeadName string // "Bearer"
	SkipPaths     []string
}

// DefaultJWTConfig returns default JWT config
func DefaultJWTConfig(secret string) JWTConfig {
	return JWTConfig{
		Secret:        secret,
		TokenLookup:   "header:Authorization",
		TokenHeadName: "Bearer",
		SkipPaths:     []string{"/health", "/ready", "/api/v1/auth/login", "/api/v1/auth/register"},
	}
}

// Claims represents JWT claims
type Claims struct {
	UserID   string   `json:"user_id"`
	Email    string   `json:"email"`
	Role     string   `json:"role"`
	SchoolID string   `json:"school_id"`
	Roles    []string `json:"roles"`
	jwt.RegisteredClaims
}

// JWTAuth creates a JWT authentication middleware
func JWTAuth(cfg JWTConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if path should be skipped
		path := c.Request.URL.Path
		for _, skipPath := range cfg.SkipPaths {
			if strings.HasPrefix(path, skipPath) {
				c.Next()
				return
			}
		}

		// Extract token
		token, err := extractToken(c, cfg)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": err.Error(),
			})
			return
		}

		// Parse and validate token
		claims, err := parseToken(token, cfg.Secret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "invalid_token",
				"message": err.Error(),
			})
			return
		}

		// Set claims in context for handlers
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Set("school_id", claims.SchoolID)
		c.Set("roles", claims.Roles)
		c.Set("claims", claims)

		c.Next()
	}
}

// extractToken extracts JWT from request
func extractToken(c *gin.Context, cfg JWTConfig) (string, error) {
	parts := strings.Split(cfg.TokenLookup, ":")
	if len(parts) != 2 {
		return "", errors.New("invalid token lookup config")
	}

	switch parts[0] {
	case "header":
		auth := c.GetHeader(parts[1])
		if auth == "" {
			return "", errors.New("missing authorization header")
		}

		// Check for Bearer prefix
		if cfg.TokenHeadName != "" {
			prefix := cfg.TokenHeadName + " "
			if !strings.HasPrefix(auth, prefix) {
				return "", errors.New("invalid authorization format")
			}
			return strings.TrimPrefix(auth, prefix), nil
		}
		return auth, nil

	case "query":
		token := c.Query(parts[1])
		if token == "" {
			return "", errors.New("missing token in query")
		}
		return token, nil

	default:
		return "", errors.New("unsupported token lookup method")
	}
}

// parseToken parses and validates JWT token
func parseToken(tokenString, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

// GenerateToken generates a new JWT token (utility for auth module)
func GenerateToken(secret string, claims Claims, expiry time.Duration) (string, error) {
	claims.RegisteredClaims = jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// GetUserID extracts user ID from Gin context
func GetUserID(c *gin.Context) string {
	if id, exists := c.Get("user_id"); exists {
		return id.(string)
	}
	return ""
}

// GetRole extracts role from Gin context
func GetRole(c *gin.Context) string {
	if role, exists := c.Get("role"); exists {
		return role.(string)
	}
	return ""
}

// RequireRole creates middleware that requires specific roles
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole := GetRole(c)
		for _, role := range roles {
			if userRole == role {
				c.Next()
				return
			}
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error":   "forbidden",
			"message": "Insufficient permissions",
		})
	}
}
