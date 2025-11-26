import { apiClient } from "../services/apiClient";

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type ChatSession = {
  sessionId: number;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
};

export type StudentAssessment = {
  assessment: string;
  studentContext: any;
  generatedAt: string;
};

export const chatbotApi = {
  // Get or create chat session
  getSession: async (): Promise<ChatSession> => {
    return apiClient.get<ChatSession>('/chat/session');
  },

  // Send message to AI
  sendMessage: async (message: string): Promise<{
    sessionId: number;
    userMessage: ChatMessage;
    aiResponse: ChatMessage;
  }> => {
    return apiClient.post('/chat/message', { message });
  },

  // Clear chat history
  clearHistory: async (): Promise<void> => {
    return apiClient.delete('/chat/history');
  },

  // Get AI assessment
  getAssessment: async (): Promise<StudentAssessment> => {
    return apiClient.get<StudentAssessment>('/chat/assessment');
  },
};

export default chatbotApi;
