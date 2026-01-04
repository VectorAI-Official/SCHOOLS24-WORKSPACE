package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/golang/snappy"
)

// RedisClient wraps Redis operations with Snappy compression
type RedisClient struct {
	rdb *redis.Client
}

// NewRedisClient creates a new Redis client with connection validation
func NewRedisClient(addr, password string, db int) (*RedisClient, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to redis: %w", err)
	}

	return &RedisClient{rdb: rdb}, nil
}

// CompressAndStore compresses the value using Snappy and stores it in Redis
func (c *RedisClient) CompressAndStore(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	jsonBytes, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal value: %w", err)
	}

	// Snappy compression
	compressed := snappy.Encode(nil, jsonBytes)

	// Store compressed data
	if err := c.rdb.Set(ctx, key, compressed, ttl).Err(); err != nil {
		return fmt.Errorf("failed to set key in redis: %w", err)
	}

	// Store metadata for "Redis-first" writes
	metaKey := fmt.Sprintf("meta:%s", key)
	meta := map[string]interface{}{
		"compressed":      true,
		"original_size":   len(jsonBytes),
		"compressed_size": len(compressed),
		"timestamp":       time.Now().Unix(),
		"synced_to_db":    false,
	}
	c.rdb.HMSet(ctx, metaKey, meta)
	c.rdb.Expire(ctx, metaKey, ttl)

	return nil
}

// FetchAndDecompress retrieves the value from Redis and decompresses it
func (c *RedisClient) FetchAndDecompress(ctx context.Context, key string, dest interface{}) error {
	val, err := c.rdb.Get(ctx, key).Bytes()
	if err != nil {
		return err
	}

	// Snappy decompression
	decompressed, err := snappy.Decode(nil, val)
	if err != nil {
		return fmt.Errorf("failed to decompress value: %w", err)
	}

	if err := json.Unmarshal(decompressed, dest); err != nil {
		return fmt.Errorf("failed to unmarshal value: %w", err)
	}

	return nil
}

// Get retrieves a raw value from Redis (uncompressed)
func (c *RedisClient) Get(ctx context.Context, key string) (string, error) {
	return c.rdb.Get(ctx, key).Result()
}

// Set stores a raw value in Redis
func (c *RedisClient) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	return c.rdb.Set(ctx, key, value, ttl).Err()
}

// Delete removes a key from Redis
func (c *RedisClient) Delete(ctx context.Context, keys ...string) error {
	return c.rdb.Del(ctx, keys...).Err()
}

// Close closes the Redis connection
func (c *RedisClient) Close() error {
	return c.rdb.Close()
}
