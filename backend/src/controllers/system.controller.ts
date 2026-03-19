import type { Request, Response } from 'express';
import { AiService } from '../services/ai.service.js';

const aiService = new AiService();

export class SystemController {
  static async aiStatus(_req: Request, res: Response) {
    res.json({
      success: true,
      data: await aiService.getStatus()
    });
  }
}
