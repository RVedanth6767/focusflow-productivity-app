import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await authService.register(req.body.email, req.body.password);
    res.status(201).json({ success: true, data: result });
  }

  static async login(req: Request, res: Response) {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json({ success: true, data: result });
  }
}
