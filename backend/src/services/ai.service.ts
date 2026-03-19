import axios from 'axios';
import { env } from '../config/env.js';

const geminiModel = 'gemini-1.5-flash';
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;
const geminiModelInfoEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}`;

export interface AiProviderStatus {
  provider: 'gemini';
  model: string;
  configured: boolean;
  fallbackMode: boolean;
  reachable: boolean;
  status: string;
}

const systemPrompt = [
  'You are FlowMind AI, a concise productivity copilot for developers.',
  "Keep answers actionable, brief, and focused on the user's current work."
].join(' ');

const buildFallbackReply = (prompt: string, detail?: string): string => {
  return [
    'FlowMind simulated response:',
    `- Request received: ${prompt}`,
    '- Suggested next step: break the work into one task and one focused pomodoro.',
    detail ?? '- Gemini service unavailable, using offline fallback mode.'
  ].join('\n');
};

export class AiService {
  async getStatus(): Promise<AiProviderStatus> {
    if (!env.GEMINI_API_KEY) {
      return {
        provider: 'gemini',
        model: geminiModel,
        configured: false,
        fallbackMode: true,
        reachable: false,
        status: 'Gemini API key is not configured. Offline fallback mode is active.'
      };
    }

    try {
      await axios.get(geminiModelInfoEndpoint, {
        headers: {
          'x-goog-api-key': env.GEMINI_API_KEY
        },
        timeout: 5000
      });

      return {
        provider: 'gemini',
        model: geminiModel,
        configured: true,
        fallbackMode: false,
        reachable: true,
        status: 'Gemini backend is reachable and the configured model responded to a health probe.'
      };
    } catch {
      return {
        provider: 'gemini',
        model: geminiModel,
        configured: true,
        fallbackMode: true,
        reachable: false,
        status: 'Gemini API key is present, but the backend could not validate the model. Offline fallback mode is active.'
      };
    }
  }

  async generateReply(prompt: string, context: Array<{ role: 'user' | 'assistant'; content: string }>) {
    if (env.GEMINI_API_KEY) {
      const conversation = context
        .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
        .join('\n');

      try {
        const response = await axios.post(
          geminiEndpoint,
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
              'Content-Type': 'application/json',
              'x-goog-api-key': env.GEMINI_API_KEY
            },
            timeout: 15000
          }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? '')
          .join('')
          .trim();

        return reply || 'I could not generate a response.';
      } catch {
        return buildFallbackReply(prompt, '- Gemini request failed, so FlowMind switched to offline fallback mode.');
      }
    }

    return buildFallbackReply(prompt, '- Gemini toolkit status: no API key detected, running in offline fallback mode.');
  }
}
