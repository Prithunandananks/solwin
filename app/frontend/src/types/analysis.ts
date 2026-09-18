export interface CustomerIntelligence {
  category: string;
  issue: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | string;
  emotion?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  resolution_status: 'Resolved' | 'Pending' | 'Escalated' | 'Unresolved' | string;
  customer_request?: string;
  summary: string;
  recommended_action?: string;
}

