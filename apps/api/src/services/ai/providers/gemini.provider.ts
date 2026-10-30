import { GoogleGenAI } from '@google/genai';
import { IAIProvider, AIProviderMessage, AIProviderOptions } from './ai-provider.interface';

export class GeminiProvider implements IAIProvider {
  public name = 'Google Gemini (Official @google/genai SDK)';
  private client: GoogleGenAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
    if (this.apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (err) {
        console.warn('[FOCUSFLOW AI] Gemini initialization error:', err);
      }
    }
  }

  public isAvailable(): boolean {
    return !!this.client && !!this.apiKey;
  }

  public async generateText(prompt: string, context?: string, options?: AIProviderOptions): Promise<string> {
    if (!this.client) {
      throw new Error('AI Provider is not configured with an API key.');
    }

    const fullPrompt = context
      ? `System Context:\n${context}\n\nUser Request:\n${prompt}`
      : prompt;

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: options?.temperature ?? 0.7,
      },
    });

    return response.text || '';
  }

  public async chat(messages: AIProviderMessage[], context?: string): Promise<string> {
    if (!this.client) {
      throw new Error('AI Provider is not configured with an API key.');
    }

    const systemInstruction = context
      ? `You are FOCUSFLOW AI Coach, an expert student productivity assistant. Help students conquer doomscrolling and maintain deep study flow.\nContext:\n${context}`
      : `You are FOCUSFLOW AI Coach, an expert student productivity assistant.`;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || '';
  }
}
