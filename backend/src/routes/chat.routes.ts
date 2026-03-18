import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { chatHistorySchema, chatMessageSchema } from './schemas.js';

export const chatRouter = Router();

chatRouter.use(authGuard);
chatRouter.post('/message', validate(chatMessageSchema), asyncHandler(ChatController.sendMessage));
chatRouter.get('/history', validate(chatHistorySchema), asyncHandler(ChatController.history));
