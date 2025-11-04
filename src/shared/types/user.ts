// User types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  displayName: string
  phone?: string
  avatarUrl?: string
  status: string
  timezone?: string
  companyId?: string
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
  company?: {
    id: string
    name: string
    type: 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL'
  }
  roles?: Array<{
    id: string
    name: string
    description?: string
  }>
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  displayName: string
  phone?: string
  timezone?: string
  companyId?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  displayName?: string
  phone?: string
  timezone?: string
  companyId?: string
  status?: string
}

export interface UserSearchParams {
  search?: string
  companyId?: string
  status?: string
  role?: string
  page?: number
  limit?: number
}

export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}