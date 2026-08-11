import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedAdmin = localStorage.getItem('admin');
    if (token && storedAdmin && storedAdmin !== 'undefined') {
      try {
        setIsAuthenticated(true);
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setIsAuthenticated(false);
        setAdmin(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin({ email, password });
      const { token, admin } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      setIsAuthenticated(true);
      setAdmin(admin);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-accent">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
