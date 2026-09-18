export type ChannelType = 'email' | 'chat' | 'sms' | 'social' | 'phone';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type SentimentType = 'Positive' | 'Neutral' | 'Negative';
export type ResolutionStatus = 'Resolved' | 'Pending' | 'Escalated' | 'Unresolved';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  sender_name: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  channel: ChannelType;
  issue: string;
  category: string;
  sentiment: SentimentType;
  priority: PriorityLevel;
  security_risk: RiskLevel;
  status: ResolutionStatus;
  updated_at: string;
  created_at: string;
  messages?: Message[];
}

export interface ConversationFilterParams {
  search?: string;
  category?: string;
  sentiment?: SentimentType | '';
  priority?: PriorityLevel | '';
  status?: ResolutionStatus | '';
  security_risk?: RiskLevel | '';
  channel?: ChannelType | '';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
