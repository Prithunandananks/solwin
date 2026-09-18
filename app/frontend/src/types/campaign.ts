import { RiskLevel } from './conversation';

export interface ThreatCampaign {
  id: string;
  name: string;
  affected_conversations_count: number;
  suspicious_domains_count: number;
  sender_patterns_count: number;
  techniques_count: number;
  common_urls: string[];
  common_domains: string[];
  common_senders: string[];
  common_techniques: string[];
  risk_level: RiskLevel;
  first_detected: string;
  last_detected: string;
  status: 'Active' | 'Investigating' | 'Neutralized';
  related_conversation_ids?: string[];
  timeline_events?: {
    date: string;
    event: string;
    severity?: string;
  }[];
}
