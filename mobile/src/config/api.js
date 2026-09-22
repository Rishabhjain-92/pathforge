import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import safeStorage from '../utils/storage';

// Production Live Render Backend URL
const PRODUCTION_URL = 'https://pathforge-backend-tmwm.onrender.com';
const PORT = '5000';

const getBaseUrl = () => {
  // Always use the live production backend URL
  if (PRODUCTION_URL) {
    return PRODUCTION_URL;
  }

  // Local development IP fallback
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.developer?.tool ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:${PORT}`;
    }
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PORT}`;
  }

  return `http://localhost:${PORT}`;
};

export const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token if present in storage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await safeStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Silently continue
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
