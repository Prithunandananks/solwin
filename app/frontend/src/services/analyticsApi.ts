import { api, isNetworkOrOfflineError } from './api';
import { DashboardOverview, CustomerAnalytics, SecurityAnalytics } from '../types/analytics';
import { mockDashboardOverview, mockCustomerAnalytics, mockSecurityAnalytics } from './mockData';

export async function getDashboardOverview(): Promise<DashboardOverview> {
  try {
    const response = await api.get<DashboardOverview>('/dashboard/overview');
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return mockDashboardOverview;
    }
    throw err;
  }
}

export async function getCustomerAnalytics(): Promise<CustomerAnalytics> {
  try {
    const response = await api.get<CustomerAnalytics>('/analytics/customer');
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return mockCustomerAnalytics;
    }
    throw err;
  }
}

export async function getCustomerInsights(): Promise<CustomerAnalytics> {
  try {
    const response = await api.get<CustomerAnalytics>('/insights/customer');
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return mockCustomerAnalytics;
    }
    throw err;
  }
}

export async function getSecurityAnalytics(): Promise<SecurityAnalytics> {
  try {
    const response = await api.get<SecurityAnalytics>('/analytics/security');
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      return mockSecurityAnalytics;
    }
    throw err;
  }
}
