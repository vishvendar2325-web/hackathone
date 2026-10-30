export interface AIProviderMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface IAIProvider {
  name: string;
  isAvailable(): boolean;
  generateText(prompt: string, context?: string, options?: AIProviderOptions): Promise<string>;
  chat(messages: AIProviderMessage[], context?: string): Promise<string>;
}
