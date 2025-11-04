// Company types
export interface Company {
  id: string
  name: string
  type: 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL'
  description?: string
  website?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  vatNumber?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  contacts?: CompanyContact[]
  summary?: {
    totalUsers: number
    activeProjects: number
    totalRevenue: number
  }
}

export interface CompanyContact {
  id: string
  companyId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  isPrimary: boolean
}

export interface CreateCompanyRequest {
  name: string
  type: 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL'
  description?: string
  website?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  vatNumber?: string
}

export interface UpdateCompanyRequest {
  name?: string
  description?: string
  website?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  vatNumber?: string
  isActive?: boolean
}

export interface CreateContactRequest {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  isPrimary?: boolean
}

export interface CompanySearchParams {
  search?: string
  type?: 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL'
  isActive?: boolean
  page?: number
  limit?: number
}

export interface CompaniesResponse {
  companies: Company[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Backend API response format
export interface CompaniesApiResponse {
  data: Company[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}