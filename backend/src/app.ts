import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { loggerMiddleware } from './config/logger.js';
import { safeRedisConnect } from './lib/redis.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiRateLimiter } from './middleware/rate-limit.middleware.js';
import { apiRouter } from './routes/index.js';

export const createApp = () => {
  const app = express();

  void safeRedisConnect();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(loggerMiddleware);
  app.use(apiRateLimiter);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/v1', apiRouter);
  app.use(errorHandler);

  return app;
};
