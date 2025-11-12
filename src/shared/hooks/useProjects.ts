import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProjectsService, type ProjectsQueryParams, type CreateProjectDto, type UpdateProjectDto } from '../services/projects.service'
import { handleApiError } from '../utils/error-handler'

// Получить проекты компании
export const useCompanyProjects = (companyId: string, params?: ProjectsQueryParams) => {
  return useQuery({
    queryKey: ['companyProjects', companyId, params],
    queryFn: () => ProjectsService.getCompanyProjects(companyId, params),
    enabled: !!companyId,
  })
}

// Получить все проекты
export const useProjects = (params?: ProjectsQueryParams) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => ProjectsService.getProjects(params),
  })
}

// Получить проект по ID
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => ProjectsService.getProjectById(projectId),
    enabled: !!projectId,
  })
}

// Создать проект
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectDto) => ProjectsService.createProject(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['companyProjects', variables.clientId] })
      toast.success('Проект создан')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Обновить проект
export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      ProjectsService.updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', data.id] })
      queryClient.invalidateQueries({ queryKey: ['companyProjects', data.clientId] })
      toast.success('Проект обновлен')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Удалить проект
export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => ProjectsService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['companyProjects'] })
      toast.success('Проект удален')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

// Subcontractors hooks
export const useProjectSubcontractors = (projectId: string) => {
  return useQuery({
    queryKey: ['projectSubcontractors', projectId],
    queryFn: () => ProjectsService.getProjectSubcontractors(projectId),
    enabled: !!projectId,
  })
}

export const useAddProjectSubcontractors = (projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => ProjectsService.addProjectSubcontractors(projectId, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectSubcontractors', projectId] })
      toast.success('Субподрядчики добавлены')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useRemoveProjectSubcontractor = (projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (companyId: string) => ProjectsService.removeProjectSubcontractor(projectId, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectSubcontractors', projectId] })
      toast.success('Субподрядчик удалён')
    },
    onError: (error: any) => {
      const message = handleApiError(error)
      toast.error(message)
    },
  })
}
