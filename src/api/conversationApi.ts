import { apiClient } from "../services/apiClient";

export type Participant = {
  id: string;
  username?: string;
  fullName?: string;
  avatar?: string | null;
};

export type ConversationListItem = {
  conversation: any;
  lastMessage: any | null;
  participants: Participant[];
};

export const conversationApi = {
  listConversations: async (): Promise<ConversationListItem[]> => {
    return apiClient.get<ConversationListItem[]>(`/conversations`);
  },

  getOrCreateConversation: async (otherUserId: string) => {
    return apiClient.get(`/conversations/${otherUserId}`);
  },

  getMessages: async (conversationId: string, params?: { limit?: number; beforeId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.append('limit', String(params.limit));
    if (params?.beforeId) qs.append('beforeId', params.beforeId);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return apiClient.get<any[]>(`/conversations/messages/${conversationId}${suffix}`);
  },

  sendMessage: async (conversationId: string, content: string) => {
    return apiClient.post<any>(`/conversations/messages/${conversationId}`, { content });
  },
};

export default conversationApi;
