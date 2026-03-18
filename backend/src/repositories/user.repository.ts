import type { User } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export class UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  create(email: string, passwordHash: string): Promise<User> {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        usageStats: {
          create: {}
        }
      }
    });
  }
}
