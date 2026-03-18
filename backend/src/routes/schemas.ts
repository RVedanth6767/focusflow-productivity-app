import { z } from 'zod';

const taskStatus = z.enum(['todo', 'in_progress', 'done']);
const taskPriority = z.enum(['low', 'medium', 'high']);

export const authSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128)
  }),
  params: z.object({}),
  query: z.object({})
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    status: taskStatus.optional(),
    priority: taskPriority.optional()
  }).refine((value) => Object.keys(value).length > 0, 'At least one field is required'),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({})
});

export const taskIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({})
});

export const chatMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(6000),
    taskId: z.string().uuid().optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const chatHistorySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    taskId: z.string().uuid().optional(),
    search: z.string().max(255).optional()
  })
});

export const pomodoroStartSchema = z.object({
  body: z.object({
    taskId: z.string().uuid().optional(),
    duration: z.number().int().min(1).max(180).default(25)
  }),
  params: z.object({}),
  query: z.object({})
});

export const pomodoroCompleteSchema = z.object({
  body: z.object({
    sessionId: z.string().uuid()
  }),
  params: z.object({}),
  query: z.object({})
});
