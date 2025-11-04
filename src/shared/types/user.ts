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
  description?: string
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
  // Work Rates
  ratePerHour?: number
  ratePerLinearMeter?: number
  ratePerM2?: number
  workTypes?: string[]
  workSchedule?: {
    monday?: { start: string; end: string }
    tuesday?: { start: string; end: string }
    wednesday?: { start: string; end: string }
    thursday?: { start: string; end: string }
    friday?: { start: string; end: string }
    saturday?: { start: string; end: string }
    sunday?: { start: string; end: string }
  }
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
  description?: string
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

// User Rates types
export interface UserRate {
  id: string
  userId: string
  ratePerHour?: number
  ratePerLinearMeter?: number
  ratePerM2?: number
  workTypes?: string[]
  workSchedule?: {
    monday?: { start: string; end: string }
    tuesday?: { start: string; end: string }
    wednesday?: { start: string; end: string }
    thursday?: { start: string; end: string }
    friday?: { start: string; end: string }
    saturday?: { start: string; end: string }
    sunday?: { start: string; end: string }
  }
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUserRatesRequest {
  ratePerHour?: number
  ratePerLinearMeter?: number
  ratePerM2?: number
  workTypes?: string[]
  workSchedule?: {
    monday?: { start: string; end: string }
    tuesday?: { start: string; end: string }
    wednesday?: { start: string; end: string }
    thursday?: { start: string; end: string }
    friday?: { start: string; end: string }
    saturday?: { start: string; end: string }
    sunday?: { start: string; end: string }
  }
}

// User Contacts types
export interface UserContact {
  id: string
  userId: string
  name: string
  phone?: string
  email?: string
  relation?: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserContactRequest {
  name: string
  phone?: string
  email?: string
  relation?: string
  isPrimary?: boolean
}

export interface UpdateUserContactRequest {
  name?: string
  phone?: string
  email?: string
  relation?: string
  isPrimary?: boolean
}

export interface UserContactsResponse {
  contacts: UserContact[]
}

// User Vacations types
export interface UserVacation {
  id: string
  userId: string
  title: string
  startDate: string
  endDate: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserVacationRequest {
  title: string
  startDate: string
  endDate: string
  description?: string
}

export interface UpdateUserVacationRequest {
  title?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface UserVacationsResponse {
  vacations: UserVacation[]
}

// User Alert Settings types
export interface UserAlertSetting {
  id: string
  userId: string
  alertType: string
  category: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateUserAlertSettingsRequest {
  alertType: string
  category: string
  isEnabled: boolean
}