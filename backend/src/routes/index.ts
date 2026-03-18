import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { chatRouter } from './chat.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { pomodoroRouter } from './pomodoro.routes.js';
import { taskRouter } from './task.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/chat', chatRouter);
apiRouter.use('/pomodoro', pomodoroRouter);
apiRouter.use('/dashboard', dashboardRouter);
