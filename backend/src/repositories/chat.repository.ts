import type { ChatMessage, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export class ChatRepository {
  create(data: Prisma.ChatMessageUncheckedCreateInput): Promise<ChatMessage> {
    return prisma.chatMessage.create({ data });
  }

  listHistory(userId: string, taskId?: string, search?: string): Promise<ChatMessage[]> {
    return prisma.chatMessage.findMany({
      where: {
        userId,
        ...(taskId ? { taskId } : {}),
        ...(search ? { content: { contains: search, mode: 'insensitive' } } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  listContext(userId: string, taskId?: string, limit = 12): Promise<ChatMessage[]> {
    return prisma.chatMessage.findMany({
      where: {
        userId,
        ...(taskId ? { taskId } : {})
      },
      orderBy: { createdAt: 'asc' },
      take: limit
    });
  }

  countUserMessages(userId: string): Promise<number> {
    return prisma.chatMessage.count({ where: { userId, role: 'user' } });
  }
}
