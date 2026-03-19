import { Router } from 'express';
import { PomodoroController } from '../controllers/pomodoro.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { pomodoroCompleteSchema, pomodoroStartSchema } from './schemas.js';

export const pomodoroRouter = Router();

pomodoroRouter.use(authGuard);
pomodoroRouter.get('/status', asyncHandler(PomodoroController.status));
pomodoroRouter.post('/start', validate(pomodoroStartSchema), asyncHandler(PomodoroController.start));
pomodoroRouter.post('/complete', validate(pomodoroCompleteSchema), asyncHandler(PomodoroController.complete));
