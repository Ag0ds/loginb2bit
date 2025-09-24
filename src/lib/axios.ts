'use client';

import axios from 'axios';
import { getAccessToken, clearAuth } from './auth';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: process.env.NEXT_PUBLIC_API_ACCEPT ?? 'application/json;version=v1_web',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      clearAuth();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        toast.error('Sessão expirada ou credenciais inválidas.');
        window.location.href = '/login';
      }
    } else {
      const msg = error?.response?.data?.detail || 'Falha na requisição.';
      toast.error(String(msg));
    }
    return Promise.reject(error);
  }
);

export default api;
