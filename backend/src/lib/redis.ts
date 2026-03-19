import { Redis } from 'ioredis';
import { env } from '../config/env.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  lazyConnect: true
});

redis.on('error', () => {
  // Redis is optional at runtime; connection errors are handled by graceful fallbacks.
});

export const safeRedisConnect = async (): Promise<void> => {
  if (redis.status === 'wait') {
    try {
      await redis.connect();
    } catch {
      // Redis is optional at runtime; services fall back gracefully.
    }
  }
};
