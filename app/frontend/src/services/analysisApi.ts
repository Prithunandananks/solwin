import { api, isNetworkOrOfflineError } from './api';
import { CustomerIntelligence, MultimodalAnalysisResult } from '../types/analysis';
import { mockCustomerIntelligence } from './mockData';

export async function getConversationAnalysis(id: string): Promise<CustomerIntelligence> {
  try {
    const response = await api.get<CustomerIntelligence>(`/analysis/conversation/${id}`);
    return response.data;
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
  const response = await api.post<CustomerIntelligence>(`/analysis/conversation/${id}`);
  return response.data;
}

export async function uploadAttachment(file: File): Promise<{ attachment_id: string; url: string; name: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return {
        attachment_id: 'att_' + Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
      };
    }
    throw err;
  }
}

export async function analyzeMultimodal(attachmentId: string): Promise<MultimodalAnalysisResult> {
  try {
    const response = await api.post<MultimodalAnalysisResult>('/analysis/multimodal', {
      attachment_id: attachmentId,
    });
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return {
        attachment_id: attachmentId,
        extracted_text: 'SOLWIN Enterprise Portal — Urgent Session Confirmation Required. Please provide your Authenticator code.',
        visual_threat_indicators: [
          'High visual brand mimicry detected (SOLWIN logo & styling)',
          'Credential Harvesting form elements detected (Username, OTP field)',
          'Deceptive urgency banners ("15 Minutes remaining")',
        ],
        detected_urls: ['https://auth-solwin-verify.cloud-login.net/confirm'],
        detected_brands: ['SOLWIN', 'Google Authenticator'],
        phishing_likelihood: 'CRITICAL',
        ocr_summary: 'Targeted spear-phishing credential harvesting landing page mimicking the enterprise SSO portal.',
      };
    }
    throw err;
  }
}
