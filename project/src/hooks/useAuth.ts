import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginCredentials } from '../types/admin';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
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

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await authAPI.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_session_id');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_session_id');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Starting login process...');
      const response = await authAPI.login(credentials);
      console.log('Login API response:', response);

      if (response.success && response.token && response.data) {
        console.log('Login successful, setting token and user data');
        localStorage.setItem('admin_token', response.token);
        setUser(response.data);
        toast.success('Login successful!');
        console.log('Login process completed successfully');
        return true;
      } else {
        console.log('Login failed - invalid response:', response);
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_session_id');
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
};
