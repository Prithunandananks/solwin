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

export interface MultimodalAnalysisResult {
  attachment_id: string;
  extracted_text?: string;
  visual_threat_indicators?: string[];
  detected_urls?: string[];
  detected_brands?: string[];
  phishing_likelihood?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ocr_summary?: string;
}
