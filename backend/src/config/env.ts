import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16).default('change-me-refresh-secret'),
  REDIS_URL: z.string().min(1),
  GEMINI_API_KEY: z.string().optional().default(''),
  CORS_ORIGIN: z.string().default('*')
});

export const env = envSchema.parse(process.env);
