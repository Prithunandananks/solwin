import { User } from '../types/auth';
import { Conversation } from '../types/conversation';
import { CustomerIntelligence } from '../types/analysis';
import { SecurityIntelligence, ThreatRecord } from '../types/security';
import { ThreatCampaign } from '../types/campaign';
import { DashboardOverview, CustomerAnalytics, SecurityAnalytics } from '../types/analytics';

export const mockUser: User = {
  id: 'usr_soc_09',
  email: 'analyst@solwin.enterprise',
  name: 'Agent Sarah Jenkins',
  role: 'soc_operator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
};

export const mockDashboardOverview: DashboardOverview = {
  total_conversations: 12842,
  total_complaints: 3284,
  unresolved: 487,
  critical_cases: 24,
  threats_detected: 156,
  high_risk: 42,
  critical_threats: 18,
  active_campaigns: 4,
  sentiment_breakdown: {
    positive_percentage: 32,
    neutral_percentage: 41,
    negative_percentage: 27,
  },
  risk_distribution: {
    low: 11840,
    medium: 786,
    high: 174,
    critical: 42,
  },
  top_issues: [
    { name: 'Account Access & Compromise', count: 1420 },
    { name: 'Billing & Unauthorized Charge', count: 980 },
    { name: 'Technical & API Failure', count: 740 },
    { name: 'Fraud & Phishing Report', count: 520 },
    { name: 'Subscription & Renewal', count: 310 },
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: 'conv_8912',
    customer_name: 'Meera Nair',
    customer_email: 'meera.nair@acme-corp.com',
    customer_phone: '+1 (555) 234-8901',
    channel: 'email',
    issue: 'Potential account compromise & OTP theft',
    category: 'Account Security',
    sentiment: 'Negative',
    priority: 'Critical',
    security_risk: 'CRITICAL',
    status: 'Unresolved',
    updated_at: '2 min ago',
    created_at: '2026-09-18T09:42:00Z',
    messages: [
      {
        id: 'msg_1',
        sender: 'customer',
        sender_name: 'Meera Nair',
        content: 'URGENT: I received an email claiming my business cloud console is locked. The email instructed me to verify my identity immediately via https://auth-solwin-verify.cloud-login.net/confirm before our payroll database gets deleted. When I clicked, it asked for my 2FA OTP code.',
        timestamp: '09:42 AM',
      },
      {
        id: 'msg_2',
        sender: 'agent',
        sender_name: 'SOLWIN Automated Triage',
        content: 'Your ticket has been flagged by our Security Intelligence engine. Please DO NOT enter any credentials or OTP codes on that link. Our Tier-2 SOC team has been immediately alerted.',
        timestamp: '09:43 AM',
      },
      {
        id: 'msg_3',
        sender: 'customer',
        sender_name: 'Meera Nair',
        content: 'The email sender was notification@solw1n-support.com. Attached is a screenshot of the login screen they redirected me to.',
        timestamp: '09:45 AM',
        attachments: [
          {
            id: 'att_01',
            name: 'fake_login_prompt.png',
            size: 245000,
            type: 'image/png',
            url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
            scan_status: 'suspicious',
            ocr_extracted_text: 'SOLWIN Enterprise Portal — Urgent Session Confirmation Required. Please provide your Authenticator code.',
          }
        ]
      }
    ],
  },
  {
    id: 'conv_8913',
    customer_name: 'David Zhao',
    customer_email: 'dzhao@globaltech.io',
    customer_phone: '+1 (555) 901-4412',
    channel: 'chat',
    issue: 'Credential stuffing alert on customer portal',
    category: 'Account Security',
    sentiment: 'Negative',
    priority: 'High',
    security_risk: 'HIGH',
    status: 'Escalated',
    updated_at: '14 min ago',
    created_at: '2026-09-18T09:30:00Z',
    messages: [
      {
        id: 'msg_20',
        sender: 'customer',
        sender_name: 'David Zhao',
        content: 'I noticed dozens of failed login attempts from an unknown Russian IP range on our executive administrator profile.',
        timestamp: '09:30 AM',
      },
      {
        id: 'msg_21',
        sender: 'agent',
        sender_name: 'SOC Analyst Sarah',
        content: 'Reviewing the IP logs now. We have applied temporary IP rate limiting and forced session invalidation.',
        timestamp: '09:33 AM',
      }
    ]
  },
  {
    id: 'conv_8914',
    customer_name: 'Elena Rostova',
    customer_email: 'elena@nordic-fintech.se',
    channel: 'sms',
    issue: 'SMS Banking Phishing / Wire change request',
    category: 'Fraud & Wire',
    sentiment: 'Negative',
    priority: 'Critical',
    security_risk: 'CRITICAL',
    status: 'Pending',
    updated_at: '28 min ago',
    created_at: '2026-09-18T09:15:00Z',
    messages: [
      {
        id: 'msg_30',
        sender: 'customer',
        sender_name: 'Elena Rostova',
        content: 'Received an SMS from "+1800-BANK" telling me our wire transfer routing code was updated to IBAN DE89370400440532013000. Is this legitimate from your billing department?',
        timestamp: '09:15 AM',
      }
    ]
  },
  {
    id: 'conv_8915',
    customer_name: 'Carlos Mendez',
    customer_email: 'cmendez@solarpulse.energy',
    channel: 'phone',
    issue: 'Invoice mismatch on enterprise plan',
    category: 'Billing',
    sentiment: 'Neutral',
    priority: 'Medium',
    security_risk: 'LOW',
    status: 'Pending',
    updated_at: '1 hour ago',
    created_at: '2026-09-18T08:45:00Z',
    messages: [
      {
        id: 'msg_40',
        sender: 'customer',
        sender_name: 'Carlos Mendez',
        content: '[Phone Call Audio Transcript] Hello, I am calling regarding invoice #INV-2026-881. Our tier pricing shows $4,200 instead of our contractual $3,800. Can someone please verify the contract terms?',
        timestamp: '08:45 AM',
      }
    ]
  },
  {
    id: 'conv_8916',
    customer_name: 'Amina Al-Mansoor',
    customer_email: 'amina@emirates-logistics.ae',
    channel: 'social',
    issue: 'Delivery tracking webhook failure',
    category: 'Technical Problems',
    sentiment: 'Positive',
    priority: 'Low',
    security_risk: 'LOW',
    status: 'Resolved',
    updated_at: '2 hours ago',
    created_at: '2026-09-18T07:30:00Z',
    messages: [
      {
        id: 'msg_50',
        sender: 'customer',
        sender_name: 'Amina Al-Mansoor',
        content: 'Thank you for updating the TLS cipher suites on your webhook endpoints. Our integration is operating smoothly now.',
        timestamp: '07:30 AM',
      }
    ]
  }
];

export const mockCustomerIntelligence: Record<string, CustomerIntelligence> = {
  conv_8912: {
    category: 'Account Security',
    issue: 'Potential account compromise & targeted phishing',
    sentiment: 'Negative',
    emotion: 'High Anxiety / Urgency',
    priority: 'Critical',
    resolution_status: 'Unresolved',
    customer_request: 'Verify validity of cloud lock notification and safeguard payroll console access',
    summary: 'Customer Meera Nair received an urgent phishing email mimicking SOLWIN infrastructure requesting 2FA authenticator codes under threat of payroll database deletion.',
    recommended_action: 'Immediately invalidate active sessions for user, block destination URL on egress firewall, and advise customer not to interact with SMS or email prompts.',
  },
  conv_8913: {
    category: 'Account Security',
    issue: 'Credential Stuffing and Brute Force',
    sentiment: 'Negative',
    emotion: 'Concern',
    priority: 'High',
    resolution_status: 'Escalated',
    customer_request: 'Investigate foreign IP range access attempts',
    summary: 'Multiple consecutive failed authentications from overseas IP blocks targeting privileged administrator accounts.',
    recommended_action: 'Enable adaptive CAPTCHA and geofencing block on offending ASN.',
  }
};

export const mockSecurityIntelligence: Record<string, SecurityIntelligence> = {
  conv_8912: {
    threat_detected: true,
    threat_type: 'Spear Phishing & Credential Harvesting',
    risk_level: 'CRITICAL',
    risk_score: 95,
    contributing_factors: [
      { factor: 'Suspicious Lookalike Domain', score: 30 },
      { factor: 'Credential / OTP Harvesting Form', score: 25 },
      { factor: 'Urgency / Coercive Language', score: 20 },
      { factor: 'Unverified Sender SPF/DKIM Mismatch', score: 20 },
    ],
    social_engineering: true,
    techniques: [
      'Artificial Urgency ("Locked in 15 mins")',
      'Credential Harvesting',
      '2FA / OTP Interception',
      'Impersonation of Cloud Admin',
    ],
    suspicious_urls: [
      {
        url: 'https://auth-solwin-verify.cloud-login.net/confirm',
        domain: 'cloud-login.net',
        https: true,
        domain_reputation: 'Malicious (Blacklisted by Spamhaus & VirusTotal)',
        lookalike_domain: true,
        url_shortener: false,
        ip_based_url: false,
        suspicious_pattern: 'Subdomain mimicry ("auth-solwin-verify")',
        risk_contribution: 35,
      }
    ],
    suspicious_emails: [
      {
        sender: 'notification@solw1n-support.com',
        display_name: 'SOLWIN Cloud Operations',
        email_domain: 'solw1n-support.com',
        expected_domain: 'solwin.enterprise',
        domain_match: false,
        lookalike_domain: true,
        impersonation: true,
        risk: 'CRITICAL',
      }
    ],
    recommended_action: 'Quarantine sender domain @solw1n-support.com globally, block IP 194.26.29.112 across SIEM/EDR, and initiate password reset protocol for target employee.',
  }
};

export const mockThreats: ThreatRecord[] = [
  {
    id: 'THR-2026-9041',
    threat_type: 'Spear Phishing',
    conversation_id: 'conv_8912',
    customer_name: 'Meera Nair',
    channel: 'email',
    risk_level: 'CRITICAL',
    threat_detected: true,
    social_engineering: true,
    detected_at: '2026-09-18 09:42 UTC',
    status: 'Active',
    intelligence: mockSecurityIntelligence['conv_8912'],
  },
  {
    id: 'THR-2026-9040',
    threat_type: 'Credential Harvesting',
    conversation_id: 'conv_8913',
    customer_name: 'David Zhao',
    channel: 'chat',
    risk_level: 'HIGH',
    threat_detected: true,
    social_engineering: true,
    detected_at: '2026-09-18 09:30 UTC',
    status: 'Investigating',
  },
  {
    id: 'THR-2026-9039',
    threat_type: 'Wire Impersonation',
    conversation_id: 'conv_8914',
    customer_name: 'Elena Rostova',
    channel: 'sms',
    risk_level: 'CRITICAL',
    threat_detected: true,
    social_engineering: true,
    detected_at: '2026-09-18 09:15 UTC',
    status: 'Active',
  },
  {
    id: 'THR-2026-9038',
    threat_type: 'Account Takeover',
    customer_name: 'Marcus Vance',
    channel: 'email',
    risk_level: 'HIGH',
    threat_detected: true,
    social_engineering: false,
    detected_at: '2026-09-18 08:20 UTC',
    status: 'Mitigated',
  },
  {
    id: 'THR-2026-9037',
    threat_type: 'Suspicious Link',
    customer_name: 'Siddharth Rao',
    channel: 'social',
    risk_level: 'MEDIUM',
    threat_detected: true,
    social_engineering: false,
    detected_at: '2026-09-18 07:11 UTC',
    status: 'Resolved',
  }
];

export const mockCampaigns: ThreatCampaign[] = [
  {
    id: 'CMP-2026-03',
    name: 'Operation CloudMimic — Lookalike Infrastructure Campaign',
    affected_conversations_count: 14,
    suspicious_domains_count: 6,
    sender_patterns_count: 3,
    techniques_count: 4,
    common_urls: [
      'https://auth-solwin-verify.cloud-login.net/confirm',
      'https://login-solwin-portal.secureserver-update.cc',
      'https://portal-solwin-billing.account-resolver.xyz'
    ],
    common_domains: [
      'cloud-login.net',
      'secureserver-update.cc',
      'solw1n-support.com',
      'account-resolver.xyz'
    ],
    common_senders: [
      'notification@solw1n-support.com',
      'security-alerts@solwin-verify.com',
      'billing-update@cloud-login.net'
    ],
    common_techniques: [
      'Artificial Urgency & Session Lockout Coercion',
      'Subdomain Mimicry of Enterprise Identity Portals',
      'Real-time Reverse Proxy OTP Harvesting',
      'SPF / DKIM Header Forgery'
    ],
    risk_level: 'CRITICAL',
    first_detected: '2026-09-16 04:12 UTC',
    last_detected: '2026-09-18 09:42 UTC',
    status: 'Active',
    related_conversation_ids: ['conv_8912', 'conv_8913', 'conv_8914'],
    timeline_events: [
      { date: '2026-09-16 04:12', event: 'First probe: 2 SMS messages targeting executive phones', severity: 'Medium' },
      { date: '2026-09-17 11:30', event: 'Domain registration: cloud-login.net spun up on bulletproof host ASN 49301', severity: 'High' },
      { date: '2026-09-18 09:42', event: 'Mass email blast: 14 enterprise employees received phishing templates with OTP reverse proxy', severity: 'Critical' }
    ]
  },
  {
    id: 'CMP-2026-02',
    name: 'FinWire Executive Impersonation Wave',
    affected_conversations_count: 8,
    suspicious_domains_count: 2,
    sender_patterns_count: 2,
    techniques_count: 3,
    common_urls: [
      'https://bank-remittance-gateway.live/auth'
    ],
    common_domains: [
      'bank-remittance-gateway.live',
      'wire-swift-desk.net'
    ],
    common_senders: [
      'cfo-office@finance-swift.org'
    ],
    common_techniques: [
      'Executive Impersonation (CEO/CFO spoofing)',
      'Wire routing manipulation',
      'High-pressure confidentiality clause'
    ],
    risk_level: 'HIGH',
    first_detected: '2026-09-12 18:00 UTC',
    last_detected: '2026-09-17 14:20 UTC',
    status: 'Investigating',
    related_conversation_ids: ['conv_8914'],
    timeline_events: [
      { date: '2026-09-12 18:00', event: 'Targeted spear phishing email sent to finance directors', severity: 'High' }
    ]
  }
];

export const mockCustomerAnalytics: CustomerAnalytics = {
  sentiment_trends: [
    { date: 'Mon', positive: 45, neutral: 35, negative: 20 },
    { date: 'Tue', positive: 40, neutral: 42, negative: 18 },
    { date: 'Wed', positive: 38, neutral: 40, negative: 22 },
    { date: 'Thu', positive: 35, neutral: 38, negative: 27 },
    { date: 'Fri', positive: 30, neutral: 43, negative: 27 },
    { date: 'Sat', positive: 36, neutral: 44, negative: 20 },
    { date: 'Sun', positive: 32, neutral: 41, negative: 27 },
  ],
  top_issues: [
    { category: 'Account Access', count: 1420, percentage: 38 },
    { category: 'Billing Inquiries', count: 980, percentage: 26 },
    { category: 'Technical Problems', count: 740, percentage: 20 },
    { category: 'Fraud & Phishing', count: 520, percentage: 14 },
    { category: 'Delivery Delay', count: 210, percentage: 6 },
    { category: 'Subscription Cancel', count: 140, percentage: 4 },
  ],
  priority_distribution: [
    { name: 'Low', count: 5400 },
    { name: 'Medium', count: 4800 },
    { name: 'High', count: 2100 },
    { name: 'Critical', count: 542 },
  ],
  resolution_distribution: [
    { status: 'Resolved', count: 9820 },
    { status: 'Pending', count: 2120 },
    { status: 'Escalated', count: 415 },
    { status: 'Unresolved', count: 487 },
  ]
};

export const mockSecurityAnalytics: SecurityAnalytics = {
  threats_over_time: [
    { date: '09/12', threats: 14, phishing: 8, credential_theft: 4, social_engineering: 2 },
    { date: '09/13', threats: 21, phishing: 12, credential_theft: 6, social_engineering: 3 },
    { date: '09/14', threats: 18, phishing: 9, credential_theft: 5, social_engineering: 4 },
    { date: '09/15', threats: 29, phishing: 17, credential_theft: 8, social_engineering: 4 },
    { date: '09/16', threats: 34, phishing: 20, credential_theft: 9, social_engineering: 5 },
    { date: '09/17', threats: 48, phishing: 28, credential_theft: 12, social_engineering: 8 },
    { date: '09/18', threats: 56, phishing: 33, credential_theft: 15, social_engineering: 8 },
  ],
  risk_distribution: [
    { name: 'LOW', value: 820, color: '#10b981' },
    { name: 'MEDIUM', value: 340, color: '#f59e0b' },
    { name: 'HIGH', value: 174, color: '#f97316' },
    { name: 'CRITICAL', value: 42, color: '#ef4444' },
  ],
  threat_types: [
    { name: 'Phishing', count: 88 },
    { name: 'Credential Theft', count: 34 },
    { name: 'Account Takeover', count: 22 },
    { name: 'Impersonation', count: 18 },
    { name: 'Wire Fraud', count: 12 },
    { name: 'Suspicious Link', count: 9 },
  ],
  social_engineering_techniques: [
    { technique: 'Urgency & Coercion', count: 74 },
    { technique: 'Credential Harvesting', count: 58 },
    { technique: 'OTP Interception', count: 39 },
    { technique: 'Authority Impersonation', count: 32 },
    { technique: 'Fear-Inducing Language', count: 28 },
  ],
  suspicious_domains: [
    { domain: 'cloud-login.net', detections: 24, risk_level: 'CRITICAL' },
    { domain: 'secureserver-update.cc', detections: 18, risk_level: 'CRITICAL' },
    { domain: 'solw1n-support.com', detections: 15, risk_level: 'CRITICAL' },
    { domain: 'account-resolver.xyz', detections: 9, risk_level: 'HIGH' },
    { domain: 'bank-remittance-gateway.live', detections: 6, risk_level: 'HIGH' },
  ],
  phishing_trends: [
    { date: 'Week 1', count: 42 },
    { date: 'Week 2', count: 68 },
    { date: 'Week 3', count: 95 },
    { date: 'Week 4', count: 134 },
  ],
  campaign_activity: [
    { campaign: 'Operation CloudMimic', events: 64 },
    { campaign: 'FinWire Impersonation', events: 28 },
    { campaign: 'AuthProxy Harvest', events: 19 },
  ]
};
