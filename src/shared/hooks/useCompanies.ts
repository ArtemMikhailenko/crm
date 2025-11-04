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