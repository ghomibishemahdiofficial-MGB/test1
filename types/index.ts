// types/index.ts

export interface SuperAgentRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface StreamEvent {
  type: 'thinking-start' | 'thinking-chunk' | 'thinking-end' | 
        'models-start' | 'model-done' | 'answer-start' | 
        'answer-chunk' | 'answer-end' | 'done' | 'error';
  data: any;
  timestamp: number;
}

export interface ModelResponse {
  modelId: string;
  text: string;
  confidence: number;
  tokensUsed: number;
  latency: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  baseWeight: number;
  specialties: TaskType[];
  supportsOnline: boolean;
  supportsReasoning: boolean;
  costPerToken: number;
}

export enum TaskType {
  CREATIVE = 'creative',
  CODING = 'coding',
  ANALYTICAL = 'analytical',
  GENERAL = 'general',
  RESEARCH = 'research',
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}