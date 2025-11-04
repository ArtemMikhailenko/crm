import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG } from './config'

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor для автоматического добавления токена
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Check if we're in the browser (client-side)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Очистим токен и редиректим на страницу логина
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Keep original FetchClient for backward compatibility
import { FetchClient } from "@/shared/utils";
import { env } from "@/env";

export const api = new FetchClient({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL,
  options: {
    credentials: "include",
  },
});
