export interface DashboardOverview {
  total_conversations: number;
  total_complaints: number;
  unresolved: number;
  critical_cases: number;
  threats_detected: number;
  high_risk: number;
  critical_threats: number;
  active_campaigns: number;
  sentiment_breakdown: {
    positive_percentage: number;
    neutral_percentage: number;
    negative_percentage: number;
  };
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  top_issues: {
    name: string;
    count: number;
  }[];
}

export interface CustomerAnalytics {
  sentiment_trends: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
  top_issues: {
    category: string;
    count: number;
    percentage: number;
  }[];
  priority_distribution: {
    name: string;
    count: number;
  }[];
  resolution_distribution: {
    status: string;
    count: number;
  }[];
}

export interface SecurityAnalytics {
  threats_over_time: {
    date: string;
    threats: number;
    phishing: number;
    credential_theft: number;
    social_engineering: number;
  }[];
  risk_distribution: {
    name: string;
    value: number;
    color?: string;
  }[];
  threat_types: {
    name: string;
    count: number;
  }[];
  social_engineering_techniques: {
    technique: string;
    count: number;
  }[];
  suspicious_domains: {
    domain: string;
    detections: number;
    risk_level: string;
  }[];
  phishing_trends: {
    date: string;
    count: number;
  }[];
  campaign_activity: {
    campaign: string;
    events: number;
  }[];
}
