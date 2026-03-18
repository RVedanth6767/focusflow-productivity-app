import type { UsageStat } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export class UsageStatsRepository {
  findByUserId(userId: string): Promise<UsageStat | null> {
    return prisma.usageStat.findUnique({ where: { userId } });
  }

  async incrementAiUsage(userId: string): Promise<UsageStat> {
    return prisma.usageStat.upsert({
      where: { userId },
      update: { aiRequestsCount: { increment: 1 } },
      create: { userId, aiRequestsCount: 1, pomodoroCount: 0 }
    });
  }

  async incrementPomodoroUsage(userId: string): Promise<UsageStat> {
    return prisma.usageStat.upsert({
      where: { userId },
      update: { pomodoroCount: { increment: 1 } },
      create: { userId, aiRequestsCount: 0, pomodoroCount: 1 }
    });
  }
}
