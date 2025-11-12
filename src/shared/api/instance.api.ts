import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG } from './config'

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: true, // Важно для session cookies
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
  
  // Логирование запроса для отладки
  console.log('🔵 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    data: config.data,
    headers: config.headers,
  })
  
  return config
})

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Логирование успешного ответа
    console.log('🟢 API Response:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error: AxiosError) => {
    // Логирование ошибки
    console.error('🔴 API Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    
    // НЕ редиректим автоматически на login при 401
    // Пусть компоненты сами решают что делать с ошибкой
    // if (error.response?.status === 401) {
    //   if (typeof window !== 'undefined') {
    //     localStorage.removeItem('authToken')
    //     window.location.href = '/auth/login'
    //   }
    // }
    
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
