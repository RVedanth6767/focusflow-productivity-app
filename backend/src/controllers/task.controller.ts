import type { Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { TaskService } from '../services/task.service.js';
import type { AuthenticatedRequest } from '../types/express.js';

const taskService = new TaskService();
const dashboardService = new DashboardService();

const getRouteParam = (value: string | string[] | undefined): string => (Array.isArray(value) ? value[0] : value ?? '');

export class TaskController {
  static async list(req: AuthenticatedRequest, res: Response) {
    const tasks = await taskService.list(req.user!.userId);
    res.json({ success: true, data: tasks });
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    const task = await taskService.create(req.user!.userId, req.body);
    await dashboardService.invalidate(req.user!.userId);
    res.status(201).json({ success: true, data: task });
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    const task = await taskService.update(req.user!.userId, getRouteParam(req.params.id), req.body);
    await dashboardService.invalidate(req.user!.userId);
    res.json({ success: true, data: task });
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    const result = await taskService.delete(req.user!.userId, getRouteParam(req.params.id));
    await dashboardService.invalidate(req.user!.userId);
    res.json({ success: true, data: result, message: 'Task deleted successfully' });
  }
}
