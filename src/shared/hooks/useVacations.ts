import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { vacationsService } from '../services/vacations.service';
import type { VacationDto } from '../types/vacation';

export function useUserVacations(userId: string | undefined) {
  return useQuery({
    queryKey: ['vacations', userId],
    queryFn: () => vacationsService.getUserVacations(userId!),
    enabled: !!userId,
  });
}

// Hook for fetching vacations for multiple users
export function useMultipleUserVacations(userIds: string[]) {
  return useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['vacations', userId],
      queryFn: () => vacationsService.getUserVacations(userId),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });
}

export function useCreateVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { title: string; startDate: string; endDate: string; description?: string } }) =>
      vacationsService.createVacation(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacations', variables.userId] });
    },
  });
}

export function useUpdateVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vacationId, data }: { vacationId: string; data: { title?: string; startDate?: string; endDate?: string; description?: string } }) =>
      vacationsService.updateVacation(vacationId, data),
    onSuccess: (vacation) => {
      queryClient.invalidateQueries({ queryKey: ['vacations', vacation.userId] });
    },
  });
}

export function useDeleteVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vacationId, userId }: { vacationId: string; userId: string }) =>
      vacationsService.deleteVacation(vacationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacations', variables.userId] });
    },
  });
}
