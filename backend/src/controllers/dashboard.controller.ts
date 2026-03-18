import type { Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import type { AuthenticatedRequest } from '../types/express.js';

const dashboardService = new DashboardService();

export class DashboardController {
  static async summary(req: AuthenticatedRequest, res: Response) {
    const summary = await dashboardService.summary(req.user!.userId);
    res.json({ success: true, data: summary });
  }
}
