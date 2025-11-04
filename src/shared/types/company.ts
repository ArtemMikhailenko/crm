// Company types
export interface Company {
  id: string
  name: string
  type: 'SUBCONTRACTOR' | 'CUSTOMER'  // Updated from API docs
  taxId?: string                   // Налоговый номер
  iban?: string                    // IBAN банковского счета
  address?: string                 // Адрес компании
  status: string                   // "active" | "inactive"
  description?: string
  website?: string
  city?: string
  postalCode?: string
  country?: string
  vatNumber?: string
  isActive?: boolean
  createdAt: string                // ISO date string
  updatedAt: string                // ISO date string
  contacts?: CompanyContact[]
  documents?: CompanyDocument[]    // Added from API docs
  projects?: CompanyProject[]      // Added from API docs
  members?: CompanyMember[]        // Члены компании
  _count?: {                       // Счетчики
    documents: number
    timeEntries: number
  }
  summary?: {
    totalUsers: number
    activeProjects: number
    totalRevenue: number
  }
}

export interface CompanyContact {
  id: string
  companyId: string
  fullName: string                 // Updated to match API: fullName instead of name
  email?: string
  phone?: string
  position?: string
  createdAt?: string
  updatedAt?: string
  // Note: isPrimary is not supported in current schema
}

export interface CompanyDocument {
  id: string
  companyId: string
  title: string
  fileKey: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
  downloadUrl?: string
}

export interface CompanyProject {
  id: string
  name: string
  projectId: string
  clientId: string
  managerId: string
  managerName: string
  status: 'Planning' | 'Review' | 'Process' | 'Pause' | 'Reuse'
  createdAt: string
  updatedAt: string
}

export interface CompanyMember {
  id: string
  companyId: string
  userId: string
  role?: string
  createdAt: string
}

export interface CreateCompanyRequest {
  name: string
  type: 'SUBCONTRACTOR' | 'CUSTOMER'
  taxId?: string
  iban?: string
  address?: string
  status?: string
  description?: string
  website?: string
  city?: string
  postalCode?: string
  country?: string
  vatNumber?: string
}

export interface UpdateCompanyRequest {
  name?: string
  type?: 'SUBCONTRACTOR' | 'CUSTOMER'
  taxId?: string
  iban?: string
  address?: string
  status?: string
  description?: string
  website?: string
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