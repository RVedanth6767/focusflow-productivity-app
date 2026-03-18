import type { NextFunction, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { AppError } from '../utils/app-error.js';

export const authGuard = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
  }

  const token = header.replace('Bearer ', '');

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
};
