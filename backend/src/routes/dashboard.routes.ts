import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';

export const dashboardRouter = Router();

dashboardRouter.use(authGuard);
dashboardRouter.get('/summary', asyncHandler(DashboardController.summary));
