import { api, isNetworkOrOfflineError } from './api';
import { Conversation, ConversationFilterParams, PaginatedResponse } from '../types/conversation';
import { mockConversations } from './mockData';

export async function getConversations(
  params?: ConversationFilterParams
): Promise<PaginatedResponse<Conversation>> {
  try {
    const response = await api.get<PaginatedResponse<Conversation>>('/conversations', { params });
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      console.warn('[SOLWIN API] Backend offline, using mock conversations');
      let filtered = [...mockConversations];

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.customer_name.toLowerCase().includes(q) ||
            c.issue.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
        );
      }
      if (params?.category) {
        filtered = filtered.filter((c) => c.category === params.category);
      }
      if (params?.sentiment) {
        filtered = filtered.filter((c) => c.sentiment === params.sentiment);
      }
      if (params?.priority) {
        filtered = filtered.filter((c) => c.priority === params.priority);
      }
      if (params?.status) {
        filtered = filtered.filter((c) => c.status === params.status);
      }
      if (params?.security_risk) {
        filtered = filtered.filter((c) => c.security_risk === params.security_risk);
      }
      if (params?.channel) {
        filtered = filtered.filter((c) => c.channel === params.channel);
      }

      return {
        data: filtered,
        total: filtered.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        total_pages: Math.max(1, Math.ceil(filtered.length / (params?.limit || 10))),
      };
    }
    throw err;
  }
}

export async function getConversation(id: string): Promise<Conversation> {
  try {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      const found = mockConversations.find((c) => c.id === id);
      if (found) return found;
      // return default mock item if id not found
      return {
        ...mockConversations[0],
        id,
        customer_name: `Customer (${id})`,
      };
    }
    throw err;
  }
}

export async function createConversation(data: Partial<Conversation>): Promise<Conversation> {
  const response = await api.post<Conversation>('/conversations', data);
  return response.data;
}
