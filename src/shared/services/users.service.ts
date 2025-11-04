import { apiClient } from '../api/instance.api'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchParams,
  UsersResponse
} from '../types/user'

export class UsersService {
    // Получить список пользователей с фильтрацией и пагинацией
  static async getUsers(params: UserSearchParams = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/users?${searchParams}`)
    return response.data
  }

  // Получить пользователя по ID
  static async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  }

  // Создать нового пользователя (только для админов)
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post('/users', userData)
    return response.data
  }

  // Обновить пользователя
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch(`/users/${id}`, userData)
    return response.data
  }

  // Удалить пользователя
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  }

  // Назначить роли пользователю
  static async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}/roles`, { roleIds })
    return response.data
  }

  // Получить профиль текущего пользователя
  static async getCurrentProfile(): Promise<User> {
    const response = await apiClient.get('/users/profile')
    return response.data
  }

  // Обновить свой профиль
  static async updateProfile(userData: Partial<UpdateUserRequest>): Promise<User> {
    const response = await apiClient.put('/users/profile', userData)
    return response.data
  }

  // Изменить пароль
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/users/password', { oldPassword, newPassword })
  }
}