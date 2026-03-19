import axios from 'axios';
import { env } from '../config/env.js';

const geminiModel = 'gemini-1.5-flash';
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;

export interface AiProviderStatus {
  provider: 'gemini';
  model: string;
  configured: boolean;
  fallbackMode: boolean;
  endpoint: string;
  apiKeyPreview: string;
}

const maskApiKey = (value: string): string => {
  if (!value) return 'Not configured';
  if (value.length <= 8) return `${value.slice(0, 2)}****${value.slice(-2)}`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const systemPrompt = [
  'You are FlowMind AI, a concise productivity copilot for developers.',
  "Keep answers actionable, brief, and focused on the user's current work."
].join(' ');

export class AiService {
  getStatus(): AiProviderStatus {
    return {
      provider: 'gemini',
      model: geminiModel,
      configured: Boolean(env.GEMINI_API_KEY),
      fallbackMode: !env.GEMINI_API_KEY,
      endpoint: geminiEndpoint,
      apiKeyPreview: maskApiKey(env.GEMINI_API_KEY)
    };
  }

  async generateReply(prompt: string, context: Array<{ role: 'user' | 'assistant'; content: string }>) {
    if (env.GEMINI_API_KEY) {
      const conversation = context
        .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
        .join('\n');

      const response = await axios.post(
        `${geminiEndpoint}?key=${env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: [
                    systemPrompt,
                    conversation ? `Conversation history:\n${conversation}` : 'Conversation history: none',
                    `Latest user request: ${prompt}`
                  ].join('\n\n')
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const reply = response.data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? '')
        .join('')
        .trim();

      return reply || 'I could not generate a response.';
    }

    return [
      'FlowMind simulated response:',
      `- Request received: ${prompt}`,
      '- Suggested next step: break the work into one task and one focused pomodoro.',
      '- Gemini toolkit status: no API key detected, running in offline fallback mode.'
    ].join('\n');
  }
}
