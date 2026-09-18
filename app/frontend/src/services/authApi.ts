import { api, isNetworkOrOfflineError } from './api';
import { AuthCredentials, AuthResponse, User } from '../types/auth';
import { mockUser } from './mockData';

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      console.warn('[SOLWIN API] Backend offline, simulating login with mock analyst session');
      // Simulate successful login with mock credentials if backend is down
      const mockResponse: AuthResponse = {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          ...mockUser,
          email: credentials.email || mockUser.email,
        },
      };
      return mockResponse;
    }
    throw err;
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (err) {
    if (isNetworkOrOfflineError(err)) {
      const stored = localStorage.getItem('solwin_auth_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // parse error
        }
      }
      return mockUser;
    }
    throw err;
  }
}

export function logout(): void {
  localStorage.removeItem('solwin_auth_token');
  localStorage.removeItem('solwin_auth_user');
}
