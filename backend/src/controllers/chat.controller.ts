import type { Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { ChatService } from '../services/chat.service.js';
import type { AuthenticatedRequest } from '../types/express.js';

const chatService = new ChatService();
const dashboardService = new DashboardService();

export class ChatController {
  static async sendMessage(req: AuthenticatedRequest, res: Response) {
    const response = await chatService.sendMessage(req.user!.userId, req.body);
    await dashboardService.invalidate(req.user!.userId);
    res.status(201).json({ success: true, data: response });
  }

  static async history(req: AuthenticatedRequest, res: Response) {
    const history = await chatService.listHistory(req.user!.userId, {
      taskId: typeof req.query.taskId === 'string' ? req.query.taskId : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined
    });
    res.json({ success: true, data: history });
  }
}
