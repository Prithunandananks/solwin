import { api, isNetworkOrOfflineError } from './api';
import { CustomerIntelligence } from '../types/analysis';
import { mockCustomerIntelligence } from './mockData';

export async function getConversationAnalysis(id: string): Promise<CustomerIntelligence> {
  try {
    const response = await api.get<{ analysis: CustomerIntelligence } | CustomerIntelligence>(`/analyze/conversation/${id}`);
    const data = response.data as any;
    return data.analysis || data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return (
        mockCustomerIntelligence[id] || {
          category: 'Account Security',
          issue: 'Suspected Account Takeover Attempt',
          sentiment: 'Negative',
          emotion: 'Distressed',
          priority: 'Critical',
          resolution_status: 'Unresolved',
          customer_request: 'Lock unauthorized session and verify login IP',
          summary: 'User detected unauthorized access from foreign IP attempting password resets.',
          recommended_action: 'Initiate emergency session revocation and notify account owner.',
        }
      );
    }
    throw err;
  }
}

export async function analyzeConversation(id: string): Promise<CustomerIntelligence> {
  const response = await api.post<{ analysis: CustomerIntelligence } | CustomerIntelligence>('/analyze', {
    conversation_id: id,
  });
  const data = response.data as any;
  return data.analysis || data;
}

