import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthCredentials } from '../types/auth';
import { login as apiLogin, logout as apiLogout } from '../services/authApi';
import { mockUser } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('solwin_auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    // Default to mock analyst session for immediate demo accessibility
    return mockUser;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      localStorage.removeItem('solwin_auth_token');
      localStorage.removeItem('solwin_auth_user');
    };

    window.addEventListener('solwin:auth_expired', handleAuthExpired);
    return () => window.removeEventListener('solwin:auth_expired', handleAuthExpired);
  }, []);

  const login = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(credentials);
      localStorage.setItem('solwin_auth_token', res.token);
      localStorage.setItem('solwin_auth_user', JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
