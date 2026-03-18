import { ChatRepository } from '../repositories/chat.repository.js';
import { TaskRepository } from '../repositories/task.repository.js';
import { UsageStatsRepository } from '../repositories/usage-stats.repository.js';
import { AppError } from '../utils/app-error.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { AiService } from './ai.service.js';

export class ChatService {
  constructor(
    private readonly chatRepository = new ChatRepository(),
    private readonly taskRepository = new TaskRepository(),
    private readonly usageStatsRepository = new UsageStatsRepository(),
    private readonly aiService = new AiService()
  ) {}

  async sendMessage(userId: string, payload: { content: string; taskId?: string }) {
    if (payload.taskId) {
      const task = await this.taskRepository.findById(payload.taskId, userId);
      if (!task) {
        throw new AppError('Task not found for chat context', 404, 'TASK_NOT_FOUND');
      }
    }

    const content = sanitizeInput(payload.content);
    const context = await this.chatRepository.listContext(userId, payload.taskId);
    const assistantReply = await this.aiService.generateReply(
      content,
      context.map((message) => ({ role: message.role, content: message.content }))
    );

    const [userMessage, assistantMessage] = await Promise.all([
      this.chatRepository.create({ userId, taskId: payload.taskId, role: 'user', content }),
      this.chatRepository.create({ userId, taskId: payload.taskId, role: 'assistant', content: assistantReply })
    ]);

    await this.usageStatsRepository.incrementAiUsage(userId);

    return {
      taskId: payload.taskId ?? null,
      messages: [userMessage, assistantMessage],
      response: {
        content: assistantReply,
        role: 'assistant',
        streaming: false
      }
    };
  }

  listHistory(userId: string, query: { taskId?: string; search?: string }) {
    return this.chatRepository.listHistory(userId, query.taskId, query.search ? sanitizeInput(query.search) : undefined);
  }
}
