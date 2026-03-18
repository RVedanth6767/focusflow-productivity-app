import Redis from 'ioredis';
import { env } from '../config/env.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  lazyConnect: true
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
