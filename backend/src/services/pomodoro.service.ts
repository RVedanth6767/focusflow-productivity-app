import { PomodoroRepository } from '../repositories/pomodoro.repository.js';
import { TaskRepository } from '../repositories/task.repository.js';
import { UsageStatsRepository } from '../repositories/usage-stats.repository.js';
import { AppError } from '../utils/app-error.js';

export class PomodoroService {
  constructor(
    private readonly pomodoroRepository = new PomodoroRepository(),
    private readonly taskRepository = new TaskRepository(),
    private readonly usageStatsRepository = new UsageStatsRepository()
  ) {}

  async start(userId: string, payload: { taskId?: string; duration: number }) {
    if (payload.taskId) {
      const task = await this.taskRepository.findById(payload.taskId, userId);
      if (!task) {
        throw new AppError('Task not found for pomodoro', 404, 'TASK_NOT_FOUND');
      }
    }

    return this.pomodoroRepository.create({
      userId,
      taskId: payload.taskId,
      duration: payload.duration,
      completed: false
    });
  }

  async complete(userId: string, payload: { sessionId: string }) {
    const session = await this.pomodoroRepository.findById(payload.sessionId, userId);
    if (!session) {
      throw new AppError('Pomodoro session not found', 404, 'POMODORO_NOT_FOUND');
    }

    const updated = await this.pomodoroRepository.update(payload.sessionId, userId, { completed: true });
    await this.usageStatsRepository.incrementPomodoroUsage(userId);
    return updated;
  }
}
