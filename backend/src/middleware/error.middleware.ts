import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: error.issues.map((issue) => issue.message).join(', '),
      errorCode: 'VALIDATION_ERROR'
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Unexpected server error',
    errorCode: 'INTERNAL_SERVER_ERROR'
  });
};
