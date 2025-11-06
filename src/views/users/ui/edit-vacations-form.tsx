"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  useUserVacations,
  useCreateUserVacation,
  useUpdateUserVacation,
  useDeleteUserVacation
} from "@/shared/hooks/useUsers";
import { Loader2, Plus, Pencil, Trash2, Calendar, Flag } from "lucide-react";
import type { UserVacation } from "@/shared/types/user";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const vacationSchema = z.object({
  title: z.string().min(1, "Vacation type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
});

export type VacationSchema = z.infer<typeof vacationSchema>;

type Props = {
  userId: string;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const VACATION_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Unpaid Leave",
  "Other",
];

export function EditVacationsForm({ userId, onCancel, onSuccess }: Props) {
  const { data: vacationsData, isLoading } = useUserVacations(userId);
  const createVacationMutation = useCreateUserVacation();
  const updateVacationMutation = useUpdateUserVacation();
  const deleteVacationMutation = useDeleteUserVacation();
  
  const [editingVacationId, setEditingVacationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<VacationSchema>({
    resolver: zodResolver(vacationSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const onSubmit = async (values: VacationSchema) => {
    try {
      if (editingVacationId) {
        // Update existing vacation
        await updateVacationMutation.mutateAsync({
          vacationId: editingVacationId,
          userId,
          title: values.title,
          startDate: values.startDate,
          endDate: values.endDate,
          description: values.description || undefined,
        });
        setEditingVacationId(null);
      } else {
        // Create new vacation
        await createVacationMutation.mutateAsync({
          userId,
          title: values.title,
          startDate: values.startDate,
          endDate: values.endDate,
          description: values.description || undefined,
        });
        setIsAdding(false);
      }
      form.reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEdit = (vacation: UserVacation) => {
    setEditingVacationId(vacation.id);
    setIsAdding(false);
    form.reset({
      title: vacation.title,
      startDate: vacation.startDate.split('T')[0],
      endDate: vacation.endDate.split('T')[0],
      description: vacation.description || "",
    });
  };

  const handleDelete = async (vacationId: string) => {
    if (confirm("Are you sure, что хотите удалить этот отпуск?")) {
      try {
        await deleteVacationMutation.mutateAsync({ vacationId, userId });
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingVacationId(null);
    form.reset({
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingVacationId(null);
    form.reset({
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleClearForm = () => {
    form.reset({
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const vacations = vacationsData || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Vacations List */}
      <div className="space-y-3">
        {vacations.map((vacation: UserVacation) => (
          <div
            key={vacation.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            {editingVacationId === vacation.id ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input placeholder="Летний отпуск" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дата окончания</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание (необязательно)</FormLabel>
                        <FormControl>
                          <textarea
                            className="min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            placeholder="Планирую поездку на море..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                      Отмена
                    </Button>
                    <Button type="submit" size="sm" disabled={updateVacationMutation.isPending}>
                      {updateVacationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Сохранить
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div className="font-medium text-slate-900">{vacation.title}</div>
                  </div>
                  <div className="text-sm text-slate-600">
                    {formatDate(vacation.startDate)} — {formatDate(vacation.endDate)}
                  </div>
                  {vacation.description && (
                    <div className="text-sm text-slate-500">{vacation.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vacation)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(vacation.id)}
                    disabled={deleteVacationMutation.isPending}
                  >
                    {deleteVacationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {vacations.length === 0 && !isAdding && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">Отпусков пока нет</p>
          </div>
        )}
      </div>

      {/* Add New Vacation Form */}
      {isAdding ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Header with delete button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-slate-700" />
                <h3 className="text-lg font-semibold text-slate-900">Add a vacation</h3>
              </div>
              <button
                type="button"
                onClick={handleClearForm}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
              >
                <Trash2 className="h-4 w-4" />
                delete
              </button>
            </div>
            
            {/* Vacation type dropdown */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Vacation type</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        {...field}
                        className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                      >
                        <option value="" className="text-slate-400">Select vacation type</option>
                        {VACATION_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select a user dropdown (disabled for now) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select a user</label>
              <div className="relative">
                <select
                  disabled
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 pr-10 text-slate-400 cursor-not-allowed"
                >
                  <option>Current user (auto-assigned)</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Start date and Completion */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Start date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          {...field}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Completion</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          {...field}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 rounded-full border-slate-300 py-6 text-base hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createVacationMutation.isPending}
                className="flex-1 rounded-full bg-slate-800 py-6 text-base hover:bg-slate-700"
              >
                {createVacationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddNew}
          disabled={editingVacationId !== null}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Vacation
        </Button>
      )}

      {/* Bottom Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Закрыть
          </Button>
        )}
      </div>
    </div>
  );
}
