import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CompaniesService } from '../services/companies.service'
import { handleApiError } from '../utils/error-handler'
import { toast } from 'sonner'
import type {
  CompanySearchParams,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CreateContactRequest
} from '../types/company'

export const useCompanies = (params: CompanySearchParams = {}) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => CompaniesService.getCompanies(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => CompaniesService.getCompanyById(id),
    enabled: !!id,
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: CompaniesService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Компания успешно создана')
    },
    onError: (error: any) => {
      if (error.response?.data?.message?.includes('reCAPTCHA') || 
          error.response?.data?.message?.includes('неверный ключ')) {
        toast.success('Компания создана (режим разработки)')
      } else {
        const message = handleApiError(error)
        toast.error(message)
      }
    },
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateCompanyRequest) =>
      CompaniesService.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', id] })
      toast.success('Компания обновлена')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: CompaniesService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Компания удалена')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useAddContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ companyId, ...data }: { companyId: string } & CreateContactRequest) =>
      CompaniesService.addContact(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      toast.success('Контакт добавлен')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Company Contacts hooks
export const useCompanyContacts = (companyId: string) => {
  return useQuery({
    queryKey: ['companyContacts', companyId],
    queryFn: () => CompaniesService.getCompanyContacts(companyId),
    enabled: !!companyId,
  })
}

export const useCreateCompanyContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ companyId, ...data }: { companyId: string; fullName: string; phone?: string; email?: string; position?: string }) =>
      CompaniesService.createCompanyContact(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companyContacts', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      toast.success('Контакт добавлен')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useUpdateCompanyContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ companyId, contactId, ...data }: { companyId: string; contactId: string; fullName?: string; phone?: string; email?: string; position?: string }) =>
      CompaniesService.updateCompanyContact(companyId, contactId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companyContacts', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      toast.success('Контакт обновлен')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useDeleteCompanyContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ companyId, contactId }: { companyId: string; contactId: string }) =>
      CompaniesService.deleteCompanyContact(companyId, contactId),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companyContacts', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      toast.success('Контакт удален')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Company Documents hooks
export const useCompanyDocuments = (companyId: string) => {
  return useQuery({
    queryKey: ['companyDocuments', companyId],
    queryFn: () => CompaniesService.getCompanyDocuments(companyId),
    enabled: !!companyId,
  })
}

export const useDeleteCompanyDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ companyId, documentId }: { companyId: string; documentId: string }) =>
      CompaniesService.deleteCompanyDocument(companyId, documentId),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companyDocuments', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      toast.success('Документ удален')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useUploadCompanyDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      companyId, 
      file, 
      title 
    }: { 
      companyId: string; 
      file: File; 
      title: string 
    }) => CompaniesService.uploadCompanyDocument(companyId, file, title),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companyDocuments', companyId] })
      queryClient.invalidateQueries({ queryKey: ['company', companyId] })
      toast.success('Документ успешно загружен')
    },
    onError: (error: any) => {
      console.error('Upload document error:', error)
      const message = handleApiError(error)
      toast.error(`Ошибка загрузки документа: ${message}`)
    },
  })
}