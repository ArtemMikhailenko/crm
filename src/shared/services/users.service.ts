import { apiClient } from '../api/instance.api'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchParams,
  UsersResponse,
  UpdateUserRatesRequest,
  UserContact,
  CreateUserContactRequest,
  UpdateUserContactRequest,
  UserContactsResponse,
  UserVacation,
  CreateUserVacationRequest,
  UpdateUserVacationRequest,
  UserVacationsResponse,
  UserAlertSetting,
  UpdateUserAlertSettingsRequest
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

  // ===== User Rates Methods =====
  
  // Обновить ставки пользователя
  static async updateUserRates(userId: string, ratesData: UpdateUserRatesRequest): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}/rates`, ratesData)
    return response.data
  }

  // ===== User Contacts Methods =====

  // Получить контакты пользователя
  static async getUserContacts(userId: string): Promise<UserContact[]> {
    const response = await apiClient.get(`/users/${userId}/contacts`)
    return response.data
  }

  // Создать новый контакт пользователя
  static async createUserContact(userId: string, contactData: CreateUserContactRequest): Promise<UserContact> {
    const response = await apiClient.post(`/users/${userId}/contacts`, contactData)
    return response.data
  }

  // Обновить контакт пользователя
  static async updateUserContact(contactId: string, contactData: UpdateUserContactRequest): Promise<UserContact> {
    const response = await apiClient.patch(`/users/contacts/${contactId}`, contactData)
    return response.data
  }

  // Удалить контакт пользователя
  static async deleteUserContact(contactId: string): Promise<void> {
    await apiClient.delete(`/users/contacts/${contactId}`)
  }

  // ===== User Vacations Methods =====

  // Получить отпуска пользователя
  static async getUserVacations(userId: string): Promise<UserVacation[]> {
    const response = await apiClient.get(`/users/${userId}/vacations`)
    return response.data
  }

  // Создать новый отпуск пользователя
  static async createUserVacation(userId: string, vacationData: CreateUserVacationRequest): Promise<UserVacation> {
    const response = await apiClient.post(`/users/${userId}/vacations`, vacationData)
    return response.data
  }

  // Обновить отпуск пользователя
  static async updateUserVacation(vacationId: string, vacationData: UpdateUserVacationRequest): Promise<UserVacation> {
    const response = await apiClient.patch(`/users/vacations/${vacationId}`, vacationData)
    return response.data
  }

  // Удалить отпуск пользователя
  static async deleteUserVacation(vacationId: string): Promise<void> {
    await apiClient.delete(`/users/vacations/${vacationId}`)
  }

  // ===== User Alert Settings Methods =====

  // Получить настройки уведомлений пользователя
  static async getUserAlertSettings(userId: string): Promise<UserAlertSetting[]> {
    const response = await apiClient.get(`/users/${userId}/alerts`)
    return response.data
  }

  // Обновить настройку уведомлений пользователя
  static async updateUserAlertSettings(userId: string, alertData: UpdateUserAlertSettingsRequest): Promise<UserAlertSetting> {
    const response = await apiClient.patch(`/users/${userId}/alerts`, alertData)
    return response.data
  }
}