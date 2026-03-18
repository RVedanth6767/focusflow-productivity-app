import { redis } from '../lib/redis.js';
import { ChatRepository } from '../repositories/chat.repository.js';
import { PomodoroRepository } from '../repositories/pomodoro.repository.js';
import { TaskRepository } from '../repositories/task.repository.js';
import { UsageStatsRepository } from '../repositories/usage-stats.repository.js';

export class DashboardService {
  constructor(
    private readonly taskRepository = new TaskRepository(),
    private readonly pomodoroRepository = new PomodoroRepository(),
    private readonly usageStatsRepository = new UsageStatsRepository(),
    private readonly chatRepository = new ChatRepository()
  ) {}

  async summary(userId: string) {
    const cacheKey = `dashboard:summary:${userId}`;
    if (redis.status === 'ready') {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as object;
      }
    }

    const [tasksCompleted, pomodorosCompleted, usageStats, recentTasks, aiMessages] = await Promise.all([
      this.taskRepository.countCompleted(userId),
      this.pomodoroRepository.countCompleted(userId),
      this.usageStatsRepository.findByUserId(userId),
      this.taskRepository.recent(userId),
      this.chatRepository.countUserMessages(userId)
    ]);

    const summary = {
      tasksCompleted,
      pomodoros: pomodorosCompleted,
      aiUsage: usageStats?.aiRequestsCount ?? aiMessages,
      recentTasks
    };

    if (redis.status === 'ready') {
      await redis.set(cacheKey, JSON.stringify(summary), 'EX', 60);
    }

    return summary;
  }

  async invalidate(userId: string) {
    if (redis.status === 'ready') {
      await redis.del(`dashboard:summary:${userId}`);
    }
  }
}
