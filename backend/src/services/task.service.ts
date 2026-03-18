import type { TaskPriority, TaskStatus } from '@prisma/client';
import { TaskRepository } from '../repositories/task.repository.js';
import { AppError } from '../utils/app-error.js';
import { sanitizeInput } from '../utils/sanitize.js';

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) {}

  list(userId: string) {
    return this.taskRepository.listByUser(userId);
  }

  create(userId: string, payload: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority }) {
    return this.taskRepository.create({
      userId,
      title: sanitizeInput(payload.title),
      description: payload.description ? sanitizeInput(payload.description) : null,
      status: payload.status ?? 'todo',
      priority: payload.priority ?? 'medium'
    });
  }

  async update(userId: string, taskId: string, payload: { title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority }) {
    const task = await this.taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return this.taskRepository.update(taskId, userId, {
      ...(payload.title !== undefined ? { title: sanitizeInput(payload.title) } : {}),
      ...(payload.description !== undefined ? { description: sanitizeInput(payload.description) } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.priority ? { priority: payload.priority } : {})
    });
  }

  async delete(userId: string, taskId: string) {
    const task = await this.taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    await this.taskRepository.delete(taskId, userId);
    return { id: taskId };
  }
}
