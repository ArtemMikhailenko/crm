import { apiClient } from '../api/instance.api'

export type ProjectStatus = 
  | 'PLANNING' 
  | 'REVIEW' 
  | 'PROCESS' 
  | 'PAUSE' 
  | 'REUSE' 
  | 'COMPLETED' 
  | 'CANCELLED'

export interface Project {
  id: string
  name: string
  projectId: string
  clientId: string
  managerId: string | null
  managerName?: string
  status: ProjectStatus
  description?: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    name: string
    type: string
  }
  manager?: {
    id: string
    email: string
    displayName: string
  }
}

export interface ProjectsQueryParams {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'name' | 'status' | 'projectId'
  sortOrder?: 'asc' | 'desc'
  clientId?: string
  managerId?: string
  status?: ProjectStatus
}

export interface ProjectsResponse {
  data: Project[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateProjectDto {
  name: string
  projectId: string
  clientId: string
  managerId?: string
  status?: ProjectStatus
  description?: string
  startDate?: string
  endDate?: string
}

export interface UpdateProjectDto {
  name?: string
  projectId?: string
  managerId?: string
  status?: ProjectStatus
  description?: string
  startDate?: string
  endDate?: string
}

export class ProjectsService {
  // Получить список проектов компании
  static async getCompanyProjects(
    companyId: string, 
    params?: ProjectsQueryParams
  ): Promise<ProjectsResponse> {
    const response = await apiClient.get(`/companies/${companyId}/projects`, { params })
    return response.data
  }

  // Получить список всех проектов
  static async getProjects(params?: ProjectsQueryParams): Promise<ProjectsResponse> {
    const response = await apiClient.get('/projects', { params })
    return response.data
  }

  // Получить проект по ID
  static async getProjectById(projectId: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${projectId}`)
    return response.data
  }

  // Создать проект
  static async createProject(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post('/projects', data)
    return response.data
  }

  // Обновить проект
  static async updateProject(projectId: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch(`/projects/${projectId}`, data)
    return response.data
  }

  // Удалить проект
  static async deleteProject(projectId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}`)
  }
}
