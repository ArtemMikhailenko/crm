import { env } from '@/env'

export const API_CONFIG = {
  // Align axios client base URL with the app-wide server URL
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  timeout: 10000,
}