import { createClient, RedisClientType } from 'redis';

// Redis client configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client
export const redisClient: RedisClientType = createClient({
  url: redisUrl,
  socket: {
    connectTimeout: 10000, // 10 seconds
  },
});

// Redis connection event handlers
redisClient.on('connect', () => {
  console.log('🔗 Redis client connected');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis client error:', err);
});

redisClient.on('end', () => {
  console.log('🔌 Redis client disconnected');
});

// Cache service class
export class CacheService {
  private client: RedisClientType;
  private defaultTTL: number = 3600; // 1 hour in seconds

  constructor(client: RedisClientType) {
    this.client = client;
  }

  // Connect to Redis
  async connect(): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  // Disconnect from Redis
  async disconnect(): Promise<void> {
    try {
      if (this.client.isOpen) {
        await this.client.disconnect();
      }
    } catch (error) {
      console.error('Failed to disconnect from Redis:', error);
    }
  }

  // Set a key-value pair with optional TTL
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const expiration = ttl || this.defaultTTL;
      await this.client.setEx(key, expiration, serializedValue);
    } catch (error) {
      console.error(`Failed to set cache key ${key}:`, error);
      throw error;
    }
  }

  // Get a value by key
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Failed to get cache key ${key}:`, error);
      return null;
    }
  }

  // Delete a key
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Failed to delete cache key ${key}:`, error);
      throw error;
    }
  }

  // Delete multiple keys by pattern
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error(`Failed to delete cache keys with pattern ${pattern}:`, error);
      throw error;
    }
  }

  // Check if a key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check existence of cache key ${key}:`, error);
      return false;
    }
  }

  // Set TTL for an existing key
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      console.error(`Failed to set TTL for cache key ${key}:`, error);
      throw error;
    }
  }

  // Get TTL for a key
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error(`Failed to get TTL for cache key ${key}:`, error);
      return -1;
    }
  }

  // Increment a numeric value
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error(`Failed to increment cache key ${key}:`, error);
      throw error;
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis ping failed:', error);
      return false;
    }
  }
}

// Create cache service instance
export const cacheService = new CacheService(redisClient);

// Cache key generators for consistent naming
export const CacheKeys = {
  // Roadmaps
  roadmapsByRole: (role: string, level: string) => `roadmaps:${role}:${level}`,
  roadmapById: (id: string) => `roadmap:${id}`,
  allRoles: () => 'roles:all',
  
  // Questions
  questionById: (id: string) => `question:${id}`,
  questionsByFilter: (filters: Record<string, any>) => {
    const filterString = Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    return `questions:filter:${filterString}`;
  },
  
  // Mock interviews
  mockInterviewById: (id: string) => `mock-interview:${id}`,
  
  // User sessions (if needed)
  userSession: (sessionId: string) => `session:${sessionId}`,
  
  // Rate limiting
  rateLimit: (ip: string, endpoint: string) => `rate-limit:${ip}:${endpoint}`,
} as const;