import { apiClient } from '../api/instance.api'
import type {
  Company,
  CompanyContact,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CreateContactRequest,
  CompanySearchParams,
  CompaniesResponse,
  CompaniesApiResponse
} from '../types/company'

export class CompaniesService {
  // Получить список компаний
  static async getCompanies(params: CompanySearchParams = {}): Promise<CompaniesResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get<CompaniesApiResponse>(`/companies?${searchParams}`)
    
    // Transform backend response to frontend format
    return {
      companies: response.data.data,
      pagination: {
        page: response.data.meta.page,
        limit: response.data.meta.pageSize,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages
      }
    }
  }

  // Получить компанию по ID
  static async getCompanyById(id: string): Promise<Company> {
    const response = await apiClient.get(`/companies/${id}`)
    return response.data
  }

  // Создать новую компанию
  static async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    const response = await apiClient.post('/companies', companyData)
    return response.data
  }

  // Обновить компанию
  static async updateCompany(id: string, companyData: UpdateCompanyRequest): Promise<Company> {
    const response = await apiClient.patch(`/companies/${id}`, companyData)
    return response.data
  }

  // Удалить компанию
  static async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/companies/${id}`)
  }

  // Получить сводку по компании
  static async getCompanySummary(id: string): Promise<Company['summary']> {
    const response = await apiClient.get(`/companies/${id}/summary`)
    return response.data
  }

  // Добавить контакт к компании
  static async addContact(companyId: string, contactData: CreateContactRequest): Promise<CompanyContact> {
    const response = await apiClient.post(`/companies/${companyId}/contacts`, contactData)
    return response.data
  }

  // Обновить контакт
  static async updateContact(contactId: string, contactData: Partial<CreateContactRequest>): Promise<CompanyContact> {
    const response = await apiClient.patch(`/companies/contacts/${contactId}`, contactData)
    return response.data
  }

  // Удалить контакт
  static async deleteContact(contactId: string): Promise<void> {
    await apiClient.delete(`/companies/contacts/${contactId}`)
  }
}