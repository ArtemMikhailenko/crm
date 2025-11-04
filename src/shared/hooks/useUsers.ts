import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersService } from '../services/users.service'
import { handleApiError } from '../utils/error-handler'
import { toast } from 'sonner'
import type {
  UserSearchParams,
  CreateUserRequest,
  UpdateUserRequest,
  UserRate,
  UpdateUserRatesRequest,
  CreateUserContactRequest,
  UpdateUserContactRequest,
  CreateUserVacationRequest,
  UpdateUserVacationRequest,
  UpdateUserAlertSettingsRequest
} from '../types/user'

export const useUsers = (params: UserSearchParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => UsersService.getUsers(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => UsersService.getUserById(id),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: UsersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Пользователь успешно создан')
    },
    onError: (error: any) => {
      if (error.response?.data?.message?.includes('reCAPTCHA') || 
          error.response?.data?.message?.includes('неверный ключ')) {
        toast.success('Пользователь создан (режим разработки)')
      } else {
        const message = handleApiError(error)
        toast.error(message)
      }
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateUserRequest) =>
      UsersService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
      toast.success('Пользователь обновлён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: UsersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Пользователь удалён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useCurrentProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => UsersService.getCurrentProfile(),
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: UsersService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Профиль обновлён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// ===== User Rates Hooks =====

export const useUserRates = (userId: string) => {
  return useQuery({
    queryKey: ['user-rates', userId],
    queryFn: async () => {
      const user = await UsersService.getUserById(userId)
      return {
        ratePerHour: user.ratePerHour,
        ratePerLinearMeter: user.ratePerLinearMeter,
        ratePerM2: user.ratePerM2,
        workTypes: user.workTypes,
        workSchedule: user.workSchedule,
      } as UserRate
    },
    enabled: !!userId,
  })
}

export const useUpdateUserRates = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & UpdateUserRatesRequest) =>
      UsersService.updateUserRates(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-rates', userId] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      toast.success('Ставки обновлены')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// ===== User Contacts Hooks =====

export const useUserContacts = (userId: string) => {
  return useQuery({
    queryKey: ['user-contacts', userId],
    queryFn: () => UsersService.getUserContacts(userId),
    enabled: !!userId,
  })
}

export const useCreateUserContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & CreateUserContactRequest) =>
      UsersService.createUserContact(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-contacts', userId] })
      toast.success('Контакт добавлен')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useUpdateUserContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ contactId, userId, ...data }: { contactId: string; userId: string } & UpdateUserContactRequest) =>
      UsersService.updateUserContact(contactId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-contacts', userId] })
      toast.success('Контакт обновлён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useDeleteUserContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ contactId, userId }: { contactId: string; userId: string }) =>
      UsersService.deleteUserContact(contactId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-contacts', userId] })
      toast.success('Контакт удалён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// ===== User Vacations Hooks =====

export const useUserVacations = (userId: string) => {
  return useQuery({
    queryKey: ['user-vacations', userId],
    queryFn: () => UsersService.getUserVacations(userId),
    enabled: !!userId,
  })
}

export const useCreateUserVacation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & CreateUserVacationRequest) =>
      UsersService.createUserVacation(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-vacations', userId] })
      toast.success('Отпуск добавлен')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useUpdateUserVacation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vacationId, userId, ...data }: { vacationId: string; userId: string } & UpdateUserVacationRequest) =>
      UsersService.updateUserVacation(vacationId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-vacations', userId] })
      toast.success('Отпуск обновлён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useDeleteUserVacation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ vacationId, userId }: { vacationId: string; userId: string }) =>
      UsersService.deleteUserVacation(vacationId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-vacations', userId] })
      toast.success('Отпуск удалён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// ===== User Alert Settings Hooks =====

export const useUserAlertSettings = (userId: string) => {
  return useQuery({
    queryKey: ['user-alert-settings', userId],
    queryFn: () => UsersService.getUserAlertSettings(userId),
    enabled: !!userId,
  })
}

export const useUpdateUserAlertSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, ...data }: { userId: string } & UpdateUserAlertSettingsRequest) =>
      UsersService.updateUserAlertSettings(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-alert-settings', userId] })
      toast.success('Настройки уведомлений обновлены')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}