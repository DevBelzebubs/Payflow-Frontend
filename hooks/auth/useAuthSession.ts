'use client';

import { api } from '@/lib/api/axiosConfig';

interface SessionData {
  token: string;
  user: unknown;
}

export function useAuthSession() {
  const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
  } as const;

  const getSession = (): SessionData | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && user) {
      try {
        return { token, user: JSON.parse(user) };
      } catch {
        return null;
      }
    }
    return null;
  };

  const saveSession = (token: string, user: unknown): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearSession = (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('service_config');
    delete api.defaults.headers.common['Authorization'];
  };

  const setAuthHeader = (token: string): void => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  return { getSession, saveSession, clearSession, setAuthHeader };
}
