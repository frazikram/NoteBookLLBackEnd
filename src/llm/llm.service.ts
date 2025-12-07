import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type HistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

@Injectable()
export class LlmService {
  constructor(private readonly config: ConfigService) {}

  async chat(options: {
    userMessage: string;
    systemPrompt?: string;
    history?: HistoryItem[];
  }): Promise<string> {
    const { userMessage, systemPrompt, history = [] } = options;

    const historyPreview =
      history.length === 0
        ? 'No previous messages.'
        : history
            .map((m, i) => {
              const truncated =
                m.content.length > 80
                  ? m.content.slice(0, 77) + '...'
                  : m.content;
              return `${i + 1}. ${m.role.toUpperCase()}: ${truncated}`;
            })
            .join('\n');

    return [
      '🤖 MOCK LLM RESPONSE',
      '',
      systemPrompt
        ? `System prompt: ${systemPrompt}`
        : 'System prompt: (none)',
      '',
      `User message: ${userMessage}`,
      '',
      'History:',
      historyPreview,
      '',
      '(No real LLM call was made. This is a mock response. ' +
        'Swap this implementation for a real provider when you have quota.)',
    ].join('\n');
  }
}
