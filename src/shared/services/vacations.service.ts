import { apiClient } from '../api/instance.api';
import type { VacationDto } from '../types/vacation';

export const vacationsService = {
  getUserVacations: async (userId: string): Promise<VacationDto[]> => {
    const response = await apiClient.get<VacationDto[]>(`/users/${userId}/vacations`);
    return response.data;
  },

  createVacation: async (
    userId: string,
    data: {
      title: string;
      startDate: string; // ISO
      endDate: string; // ISO
      description?: string;
    }
  ): Promise<VacationDto> => {
    const response = await apiClient.post<VacationDto>(`/users/${userId}/vacations`, data);
    return response.data;
  },

  updateVacation: async (
    vacationId: string,
    data: {
      title?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }
  ): Promise<VacationDto> => {
    const response = await apiClient.patch<VacationDto>(`/users/vacations/${vacationId}`, data);
    return response.data;
  },

  deleteVacation: async (vacationId: string): Promise<void> => {
    await apiClient.delete(`/users/vacations/${vacationId}`);
  },
};
