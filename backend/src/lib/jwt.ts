import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedUser } from '../types/express.js';

const ACCESS_EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '7d';

export const signAccessToken = (payload: AuthenticatedUser): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

export const signRefreshToken = (payload: AuthenticatedUser): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

export const verifyAccessToken = (token: string): AuthenticatedUser =>
  jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
