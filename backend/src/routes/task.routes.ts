import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { createTaskSchema, taskIdSchema, updateTaskSchema } from './schemas.js';

export const taskRouter = Router();

taskRouter.use(authGuard);
taskRouter.get('/', asyncHandler(TaskController.list));
taskRouter.post('/', validate(createTaskSchema), asyncHandler(TaskController.create));
taskRouter.put('/:id', validate(updateTaskSchema), asyncHandler(TaskController.update));
taskRouter.delete('/:id', validate(taskIdSchema), asyncHandler(TaskController.delete));
