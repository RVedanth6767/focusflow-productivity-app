import type { PomodoroSession, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export class PomodoroRepository {
  create(data: Prisma.PomodoroSessionUncheckedCreateInput): Promise<PomodoroSession> {
    return prisma.pomodoroSession.create({ data });
  }

  update(id: string, userId: string, data: Prisma.PomodoroSessionUpdateInput): Promise<PomodoroSession> {
    return prisma.pomodoroSession.update({ where: { id_userId: { id, userId } }, data });
  }

  findById(id: string, userId: string): Promise<PomodoroSession | null> {
    return prisma.pomodoroSession.findFirst({ where: { id, userId } });
  }

  countCompleted(userId: string): Promise<number> {
    return prisma.pomodoroSession.count({ where: { userId, completed: true } });
  }
}
