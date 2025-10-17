import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/user.types';
import type { LoginDto } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (data: LoginDto) => Promise<User>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Hanya check auth jika tidak di halaman login/register
      const currentPath = window.location.pathname;
      const publicPaths = ['/login', '/register', '/'];

      if (publicPaths.includes(currentPath)) {
        setIsLoading(false);
        return;
      }

      const response = await authService.getProfile();
      setUser(response.data);
    } catch (error: any) {
      console.error('Auth check failed:', error);
      setUser(null);

      // Hanya redirect jika error 401 dan tidak di public pages
      const currentPath = window.location.pathname;
      const publicPaths = ['/login', '/register', '/'];

      if (error.response?.status === 401 && !publicPaths.includes(currentPath)) {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginDto): Promise<User> => {
    try {
      await authService.login(data);
      const response = await authService.getProfile();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};