import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback in case native storage is temporarily unavailable
const memoryStorage = {};

const safeStorage = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      }
      const val = await AsyncStorage.getItem(key);
      return val !== null ? val : (memoryStorage[key] || null);
    } catch (err) {
      return memoryStorage[key] || null;
    }
  },

  setItem: async (key, value) => {
    try {
      memoryStorage[key] = value;
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      }
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      // Memory fallback holds it during current session
      memoryStorage[key] = value;
    }
  },

  removeItem: async (key) => {
    try {
      delete memoryStorage[key];
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      }
      await AsyncStorage.removeItem(key);
    } catch (err) {
      delete memoryStorage[key];
    }
  },
};

export default safeStorage;
