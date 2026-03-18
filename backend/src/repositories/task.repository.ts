import type { Prisma, Task } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export class TaskRepository {
  listByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  update(id: string, userId: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({ where: { id_userId: { id, userId } }, data });
  }

  delete(id: string, userId: string): Promise<Task> {
    return prisma.task.delete({ where: { id_userId: { id, userId } } });
  }

  findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id, userId } });
  }

  countCompleted(userId: string): Promise<number> {
    return prisma.task.count({ where: { userId, status: 'done' } });
  }

  recent(userId: string, limit = 5): Promise<Task[]> {
    return prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }
}
