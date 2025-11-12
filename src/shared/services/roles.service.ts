import { apiClient } from '../api/instance.api';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export class RolesService {
  // Получить все роли
  static async getRoles(): Promise<Role[]> {
    const response = await apiClient.get('/rbac/roles');
    return response.data;
  }
}
