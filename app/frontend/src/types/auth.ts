export interface User {
  id: string;
  email: string;
  name: string;
  role: 'analyst' | 'admin' | 'soc_operator';
  avatarUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}
