import OpenAI from 'openai';
import { env } from '../config/env.js';

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export class AiService {
  async generateReply(prompt: string, context: Array<{ role: 'user' | 'assistant'; content: string }>) {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content: 'You are FlowMind AI, a concise productivity copilot for developers.'
          },
          ...context,
          { role: 'user', content: prompt }
        ]
      });

      return completion.choices[0]?.message?.content ?? 'I could not generate a response.';
    }

    return [
      'FlowMind simulated response:',
      `- Request received: ${prompt}`,
      '- Suggested next step: break the work into one task and one focused pomodoro.',
      '- Developer note: keep momentum by capturing blockers in chat history.'
    ].join('\n');
  }
}
