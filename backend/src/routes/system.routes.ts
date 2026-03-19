import { Router } from 'express';
import { SystemController } from '../controllers/system.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

export const systemRouter = Router();

systemRouter.get('/ai-status', asyncHandler(SystemController.aiStatus));
