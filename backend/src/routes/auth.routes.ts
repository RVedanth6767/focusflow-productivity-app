import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { authSchema } from './schemas.js';

export const authRouter = Router();

authRouter.post('/register', validate(authSchema), asyncHandler(AuthController.register));
authRouter.post('/login', validate(authSchema), asyncHandler(AuthController.login));
