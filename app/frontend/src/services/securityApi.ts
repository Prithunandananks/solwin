import { api, isNetworkOrOfflineError } from './api';
import { ThreatRecord, ThreatFilterParams, SecurityIntelligence } from '../types/security';
import { mockThreats, mockSecurityIntelligence } from './mockData';
import { PaginatedResponse } from '../types/conversation';

export async function getThreats(
  params?: ThreatFilterParams
): Promise<PaginatedResponse<ThreatRecord>> {
  try {
    const response = await api.get<PaginatedResponse<ThreatRecord>>('/security/threats', { params });
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      let filtered = [...mockThreats];

      if (params?.risk_level) {
        filtered = filtered.filter((t) => t.risk_level === params.risk_level);
      }
      if (params?.threat_type) {
        filtered = filtered.filter((t) => t.threat_type === params.threat_type);
      }
      if (params?.status) {
        filtered = filtered.filter((t) => t.status === params.status);
      }
      if (params?.channel) {
        filtered = filtered.filter((t) => t.channel === params.channel);
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

export async function getThreat(id: string): Promise<ThreatRecord> {
  try {
    const response = await api.get<ThreatRecord>(`/security/threats/${id}`);
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      const found = mockThreats.find((t) => t.id === id);
      if (found) return found;
      return {
        ...mockThreats[0],
        id,
      };
    }
    throw err;
  }
}

export async function getSecurityIntelligenceForConversation(
  conversationId: string
): Promise<SecurityIntelligence> {
  try {
    const response = await api.get<any>(`/security/conversation/${conversationId}`);
    const threat = response.data?.threat || response.data;
    return {
      threat_detected: threat.threat_detected,
      threat_type: threat.threat_type,
      risk_level: threat.risk_level || 'LOW',
      social_engineering: threat.social_engineering_detected,
      techniques: threat.techniques || [],
      suspicious_urls: (threat.suspicious_urls || []).map((u: any) =>
        typeof u === 'string' ? { url: u, domain: u, https: u.startsWith('https') } : u
      ),
      suspicious_emails: (threat.suspicious_emails || []).map((e: any) =>
        typeof e === 'string' ? { sender: e, display_name: '', email_domain: '', expected_domain: '', domain_match: false, lookalike_domain: false, impersonation: false, risk: 'HIGH' } : e
      ),
      recommended_action: threat.recommended_action,
    };
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return (
        mockSecurityIntelligence[conversationId] || {
          threat_detected: false,
          risk_level: 'LOW',
          techniques: [],
          suspicious_urls: [],
          suspicious_emails: [],
          recommended_action: 'Standard support resolution path. No active threat indicators detected.',
        }
      );
    }
    throw err;
  }
}

export async function analyzeSecurity(data: unknown): Promise<SecurityIntelligence> {
  const response = await api.post<SecurityIntelligence>('/security/analyze', data);
  return response.data;
}
