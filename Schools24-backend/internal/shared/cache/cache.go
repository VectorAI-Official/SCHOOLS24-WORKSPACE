package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/allegro/bigcache/v3"
	"github.com/golang/snappy"
)

// Cache provides an in-memory cache with Snappy compression
// Replaces Redis for single-instance deployments (Oracle ARM VM)
type Cache struct {
	bc *bigcache.BigCache
}

// Config holds cache configuration
type Config struct {
	MaxSizeMB      int           // Maximum cache size in MB
	TTL            time.Duration // Default TTL for entries
	CleanupSeconds int           // Cleanup interval
}

// DefaultConfig returns optimized config for low memory usage
func DefaultConfig() Config {
	return Config{
		MaxSizeMB:      256, // 256 MB max cache size
		TTL:            10 * time.Minute,
		CleanupSeconds: 60,
	}
}

// New creates a new in-memory cache
func New(cfg Config) (*Cache, error) {
	config := bigcache.Config{
		// Number of shards (must be power of 2)
		Shards: 1024,
		// Time after which entry can be evicted
		LifeWindow: cfg.TTL,
		// Interval between removing expired entries
		CleanWindow: time.Duration(cfg.CleanupSeconds) * time.Second,
		// Max size of entry in bytes (10 MB)
		MaxEntrySize: 10 * 1024 * 1024,
		// Max cache size in MB
		HardMaxCacheSize: cfg.MaxSizeMB,
		// Callback on entry removal (optional)
		OnRemove: nil,
		// Logger (disable verbose logging)
		Verbose: false,
	}

	bc, err := bigcache.New(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create cache: %w", err)
	}

	return &Cache{bc: bc}, nil
}

// CompressAndStore compresses the value using Snappy and stores it
func (c *Cache) CompressAndStore(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	jsonBytes, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal value: %w", err)
	}

	// Snappy compression for memory efficiency
	compressed := snappy.Encode(nil, jsonBytes)

	if err := c.bc.Set(key, compressed); err != nil {
		return fmt.Errorf("failed to set key: %w", err)
	}

	return nil
}

// FetchAndDecompress retrieves and decompresses the value
func (c *Cache) FetchAndDecompress(ctx context.Context, key string, dest interface{}) error {
	val, err := c.bc.Get(key)
	if err != nil {
		return err // Returns bigcache.ErrEntryNotFound if not found
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

// Get retrieves a raw string value (uncompressed)
func (c *Cache) Get(ctx context.Context, key string) (string, error) {
	val, err := c.bc.Get(key)
	if err != nil {
		return "", err
	}
	return string(val), nil
}

// Set stores a raw value (uncompressed)
func (c *Cache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	var data []byte
	switch v := value.(type) {
	case string:
		data = []byte(v)
	case []byte:
		data = v
	default:
		jsonBytes, err := json.Marshal(value)
		if err != nil {
			return err
		}
		data = jsonBytes
	}
	return c.bc.Set(key, data)
}

// Delete removes a key from cache
func (c *Cache) Delete(ctx context.Context, keys ...string) error {
	for _, key := range keys {
		if err := c.bc.Delete(key); err != nil {
			// Ignore "entry not found" errors
			if err != bigcache.ErrEntryNotFound {
				return err
			}
		}
	}
	return nil
}

// Close closes the cache
func (c *Cache) Close() error {
	return c.bc.Close()
}

// Stats returns cache statistics
func (c *Cache) Stats() bigcache.Stats {
	return c.bc.Stats()
}

// Len returns number of entries in cache
func (c *Cache) Len() int {
	return c.bc.Len()
}
