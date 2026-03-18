import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '../lib/jwt.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/app-error.js';
import { sanitizeInput } from '../utils/sanitize.js';

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(email: string, password: string) {
    const normalizedEmail = sanitizeInput(email).toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError('Email already registered', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userRepository.create(normalizedEmail, passwordHash);
    const payload = { userId: user.id, email: user.email };

    return {
      user: payload,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = sanitizeInput(email).toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const payload = { userId: user.id, email: user.email };
    return {
      user: payload,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    };
  }
}
