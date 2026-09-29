// ============================================================
// AUTHENTICATION CONTEXT
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (mobile: string, otp: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role, userId?: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick demo user accounts
export const DEMO_USERS: Record<string, { mobile: string; name: string; role: Role }> = {
  'STU001': { mobile: '9876543210', name: 'Rahul Kumar (Student - Jharkhand)', role: 'student' },
  'STU002': { mobile: '9876543211', name: 'Priya Munda (Disbursed Student - Odisha)', role: 'student' },
  'STU003': { mobile: '9876543212', name: 'Amit Oraon (Sanctioned - IIT Dhanbad)', role: 'student' },
  'STU004': { mobile: '9876543213', name: 'Sunita Bhil (Pre-Matric - Rajasthan)', role: 'student' },
  'STU005': { mobile: '9876543214', name: 'Vikash Gond (NFST PhD - MP)', role: 'student' },
  'ADM001': { mobile: '9876543230', name: 'MoTA Administrator', role: 'admin' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('mota_token');
    const savedUser = localStorage.getItem('mota_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('mota_token');
        localStorage.removeItem('mota_user');
      }
    } else {
      // Default to Rahul for easy prototype review
      login('9876543210', '123456');
    }
    setIsLoading(false);
  }, []);

  const login = async (mobile: string, otp: string): Promise<boolean> => {
    try {
      const res = await api.verifyOtp(mobile, otp);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('mota_token', res.token);
        localStorage.setItem('mota_user', JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mota_token');
    localStorage.removeItem('mota_user');
  };

  const switchRole = async (_role: Role, userId: string = 'STU001') => {
    const targetUser = DEMO_USERS[userId] || DEMO_USERS['STU001'];
    await login(targetUser.mobile, '123456');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
