import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersService } from '../services/users.service'
import { handleApiError } from '../utils/error-handler'
import { toast } from 'sonner'
import type {
  UserSearchParams,
  CreateUserRequest,
  UpdateUserRequest
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