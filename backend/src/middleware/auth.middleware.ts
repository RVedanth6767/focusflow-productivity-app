import type { NextFunction, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { AppError } from '../utils/app-error.js';

export const authGuard = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
      return;
    }

    const token = header.replace('Bearer ', '');
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
};
