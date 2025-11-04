import axios from 'axios'
import { apiClient } from '../api/instance.api'
import type {
  Company,
  CompanyContact,
  CompanyDocument,
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

  // ===== New Company Contacts Methods (according to API docs) =====
  
  // Получить все контакты компании
  static async getCompanyContacts(companyId: string): Promise<CompanyContact[]> {
    const response = await apiClient.get(`/companies/${companyId}/contacts`)
    return response.data
  }

  // Создать контакт компании
  static async createCompanyContact(companyId: string, data: { fullName: string; phone?: string; email?: string; position?: string }): Promise<CompanyContact> {
    const response = await apiClient.post(`/companies/${companyId}/contacts`, data)
    return response.data
  }

  // Обновить контакт компании
  static async updateCompanyContact(companyId: string, contactId: string, data: { fullName?: string; phone?: string; email?: string; position?: string }): Promise<CompanyContact> {
    const response = await apiClient.patch(`/companies/${companyId}/contacts/${contactId}`, data)
    return response.data
  }

  // Удалить контакт компании
  static async deleteCompanyContact(companyId: string, contactId: string): Promise<void> {
    await apiClient.delete(`/companies/${companyId}/contacts/${contactId}`)
  }

  // ===== Company Documents Methods =====
  
  // Получить все документы компании
  static async getCompanyDocuments(companyId: string): Promise<CompanyDocument[]> {
    const response = await apiClient.get(`/companies/${companyId}/documents`)
    return response.data
  }

    // Загрузить документ компании (3-step process with presigned URL)
  static async uploadCompanyDocument(companyId: string, file: File, title: string): Promise<CompanyDocument> {
    try {
      // Step 1: Get presigned URL from backend
      console.log('Step 1: Requesting presigned URL...', { companyId, title, fileName: file.name })
      const { data: presignedData } = await apiClient.post(
        `/companies/${companyId}/documents/upload`,
        {
          title,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }
      )
      console.log('Step 1: Presigned data received:', presignedData)

      // Check if this is a mock S3 URL
      if (presignedData.uploadUrl.includes('mock-s3')) {
        console.warn('Mock S3 URL detected - skipping actual upload to S3')
        
        // Step 3: Confirm "upload" for mock
        console.log('Step 3: Confirming mock upload...', presignedData.documentId)
        const { data: document } = await apiClient.post(
          `/companies/${companyId}/documents/${presignedData.documentId}/confirm`
        )
        console.log('Step 3: Mock upload confirmed, document:', document)
        
        return document
      }

      // Step 2: Upload file directly to real S3 using plain axios (no auth headers)
      console.log('Step 2: Uploading to S3...', presignedData.uploadUrl)
      await axios.put(presignedData.uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      console.log('Step 2: Upload to S3 successful')

      // Step 3: Confirm upload
      console.log('Step 3: Confirming upload...', presignedData.documentId)
      const { data: document } = await apiClient.post(
        `/companies/${companyId}/documents/${presignedData.documentId}/confirm`
      )
      console.log('Step 3: Upload confirmed, document:', document)

      return document
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }

  // Удалить документ компании
  static async deleteCompanyDocument(companyId: string, documentId: string): Promise<void> {
    await apiClient.delete(`/companies/${companyId}/documents/${documentId}`)
  }
}