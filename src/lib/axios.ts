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
    if (!error?.response) {
      toast.error('Sem conexão com o servidor.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 || status === 403) {
      clearAuth();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        toast.error('Sessão expirada ou credenciais inválidas.');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (status === 400) {
      const hasFieldErrors = data && (data.email || data.password);
      if (!hasFieldErrors) {
        toast.error(String(data?.detail || 'Falha na requisição.'));
      }
      return Promise.reject(error);
    }
    const msg = data?.detail || 'Falha na requisição.';
    toast.error(String(msg));
    return Promise.reject(error);
  }
);

export default api;
