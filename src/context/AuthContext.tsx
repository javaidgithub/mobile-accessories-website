import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  isAdmin: boolean;
  user: AdminUser | null;
  token: string | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (username: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('apex_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('apex_admin_token') || null;
  });

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('apex_admin_user', JSON.stringify(data.user));
      localStorage.setItem('apex_admin_token', data.token);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('apex_admin_user');
    localStorage.removeItem('apex_admin_token');
  };

  const updateUserProfile = (username: string, email: string) => {
    if (user) {
      const updated = { ...user, username, email };
      setUser(updated);
      localStorage.setItem('apex_admin_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin: !!token, user, token, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
