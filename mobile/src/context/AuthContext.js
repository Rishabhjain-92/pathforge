import React, { createContext, useState, useEffect, useContext } from 'react';
import safeStorage from '../utils/storage';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await safeStorage.getItem('token');
      const storedUser = await safeStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.warn('Failed to load stored auth credentials', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userToken, userData) => {
    try {
      await safeStorage.setItem('token', userToken);
      await safeStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
    } catch (err) {
      console.error('Failed to save login data', err);
    }
  };

  const logout = async () => {
    try {
      await safeStorage.removeItem('token');
      await safeStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Failed to clear auth state', err);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/api/user/profile');
      if (res.data?.user) {
        await safeStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Failed to refresh user profile', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
