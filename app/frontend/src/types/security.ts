import { RiskLevel } from './conversation';

export interface SuspiciousUrl {
  url: string;
  domain: string;
  https: boolean;
  domain_reputation?: string;
  lookalike_domain?: boolean;
  url_shortener?: boolean;
  ip_based_url?: boolean;
  suspicious_pattern?: string;
  risk_contribution?: number;
}

export interface SuspiciousEmail {
  sender: string;
  display_name: string;
  email_domain: string;
  expected_domain: string;
  domain_match: boolean;
  lookalike_domain: boolean;
  impersonation: boolean;
  risk: RiskLevel;
}

export interface ContributingRiskFactor {
  factor: string;
  score: number;
}

export interface SecurityIntelligence {
  threat_detected: boolean;
  threat_type?: string;
  risk_level: RiskLevel;
  risk_score?: number;
  contributing_factors?: ContributingRiskFactor[];
  social_engineering?: boolean;
  techniques: string[];
  suspicious_urls: SuspiciousUrl[];
  suspicious_emails: SuspiciousEmail[];
  recommended_action?: string;
}

export interface ThreatRecord {
  id: string;
  threat_type: string;
  conversation_id?: string;
  customer_name: string;
  channel: string;
  risk_level: RiskLevel;
  threat_detected: boolean;
  social_engineering: boolean;
  detected_at: string;
  status: 'Active' | 'Investigating' | 'Mitigated' | 'Resolved';
  intelligence?: SecurityIntelligence;
}

export interface ThreatFilterParams {
  risk_level?: RiskLevel | '';
  threat_type?: string;
  status?: string;
  channel?: string;
  date?: string;
  page?: number;
  limit?: number;
}
