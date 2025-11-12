export type VacationDto = {
  id: string;
  userId: string;
  title: string;
  startDate: string; // ISO
  endDate: string; // ISO
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VacationType = 'vacation' | 'weekend' | 'sick-leave';

export type VacationWithType = VacationDto & {
  type?: VacationType;
};
