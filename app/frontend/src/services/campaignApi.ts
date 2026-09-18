import { api, isNetworkOrOfflineError } from './api';
import { ThreatCampaign } from '../types/campaign';
import { mockCampaigns } from './mockData';

export async function getCampaigns(): Promise<ThreatCampaign[]> {
  try {
    const response = await api.get<ThreatCampaign[]>('/campaigns');
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return mockCampaigns;
    }
    throw err;
  }
}

export async function getCampaign(id: string): Promise<ThreatCampaign> {
  try {
    const response = await api.get<ThreatCampaign>(`/campaigns/${id}`);
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      const found = mockCampaigns.find((c) => c.id === id);
      if (found) return found;
      return {
        ...mockCampaigns[0],
        id,
      };
    }
    throw err;
  }
}
