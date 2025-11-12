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
  pageSize?: number
  // Backend expects single string like "field:direction"
  sort?: string // e.g. "createdAt:desc"
  clientId?: string
  managerId?: string
  subcontractorId?: string
  status?: ProjectStatus
  search?: string
}

export interface ProjectsResponse {
  data: Project[]
  total: number
  page: number
  pageSize: number
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
  subcontractorIds?: string[]
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
    // Transform frontend params to backend expected format (pageSize vs limit, etc.)
    const backendParams: Record<string, any> = { ...params }
    if (backendParams.pageSize && !backendParams.limit) {
      backendParams.pageSize = backendParams.pageSize
    }
    // axios will serialize params; just ensure no undefined values
    Object.keys(backendParams).forEach(key => backendParams[key] === undefined && delete backendParams[key])
    const response = await apiClient.get('/projects', { params: backendParams })
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

  // ===== Subcontractors endpoints =====
  static async getProjectSubcontractors(projectId: string): Promise<{ id: string; name: string }[]> {
    const { data } = await apiClient.get(`/projects/${projectId}/subcontractors`)
    // normalize to array of company objects if backend returns wrappers
    if (Array.isArray(data)) {
      // if items like { subcontractor: { id, name } }
      return data.map((x: any) => (x?.subcontractor ? x.subcontractor : x))
    }
    return data
  }

  static async addProjectSubcontractors(projectId: string, subcontractorIds: string[]): Promise<void> {
    await apiClient.post(`/projects/${projectId}/subcontractors`, { subcontractorIds })
  }

  static async removeProjectSubcontractor(projectId: string, companyId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/subcontractors/${companyId}`)
  }
}
