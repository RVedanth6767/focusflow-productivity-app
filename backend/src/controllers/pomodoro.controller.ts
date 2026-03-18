import type { Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { PomodoroService } from '../services/pomodoro.service.js';
import type { AuthenticatedRequest } from '../types/express.js';

const pomodoroService = new PomodoroService();
const dashboardService = new DashboardService();

export class PomodoroController {
  static async start(req: AuthenticatedRequest, res: Response) {
    const session = await pomodoroService.start(req.user!.userId, req.body);
    await dashboardService.invalidate(req.user!.userId);
    res.status(201).json({ success: true, data: session });
  }

  static async complete(req: AuthenticatedRequest, res: Response) {
    const session = await pomodoroService.complete(req.user!.userId, req.body);
    await dashboardService.invalidate(req.user!.userId);
    res.status(200).json({ success: true, data: session });
  }
}
