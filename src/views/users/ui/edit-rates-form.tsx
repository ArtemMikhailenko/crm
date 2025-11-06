"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useUpdateUserRates } from "@/shared/hooks/useUsers";
import { Loader2, Plus, X } from "lucide-react";
import type { UserRate } from "@/shared/types/user";

const dayScheduleSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format: HH:MM"),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format: HH:MM"),
});

const editRatesSchema = z.object({
  ratePerHour: z.string().optional(),
  ratePerLinearMeter: z.string().optional(),
  ratePerM2: z.string().optional(),
  workTypes: z.array(z.object({ value: z.string() })).optional(),
  workSchedule: z.object({
    monday: dayScheduleSchema.optional(),
    tuesday: dayScheduleSchema.optional(),
    wednesday: dayScheduleSchema.optional(),
    thursday: dayScheduleSchema.optional(),
    friday: dayScheduleSchema.optional(),
    saturday: dayScheduleSchema.optional(),
    sunday: dayScheduleSchema.optional(),
  }).optional(),
});

export type EditRatesSchema = z.infer<typeof editRatesSchema>;

type Props = {
  userId: string;
  rates?: UserRate | null;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

export function EditRatesForm({ userId, rates, onCancel, onSuccess }: Props) {
  const updateRatesMutation = useUpdateUserRates();

  const form = useForm<EditRatesSchema>({
    resolver: zodResolver(editRatesSchema),
    defaultValues: {
      ratePerHour: rates?.ratePerHour?.toString() || "",
      ratePerLinearMeter: rates?.ratePerLinearMeter?.toString() || "",
      ratePerM2: rates?.ratePerM2?.toString() || "",
      workTypes: rates?.workTypes?.map(value => ({ value })) || [],
      workSchedule: rates?.workSchedule || {},
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workTypes",
  });

  const onSubmit = async (values: EditRatesSchema) => {
    try {
      const workSchedule: any = {};
      
      // Only add days with filled values
      DAYS.forEach(({ key }) => {
        const dayValue = values.workSchedule?.[key];
        if (dayValue?.start && dayValue?.end) {
          workSchedule[key] = dayValue;
        }
      });

      await updateRatesMutation.mutateAsync({
        userId,
        ratePerHour: values.ratePerHour ? Number(values.ratePerHour) : undefined,
        ratePerLinearMeter: values.ratePerLinearMeter ? Number(values.ratePerLinearMeter) : undefined,
        ratePerM2: values.ratePerM2 ? Number(values.ratePerM2) : undefined,
        workTypes: values.workTypes?.map(item => item.value).filter(Boolean),
        workSchedule: Object.keys(workSchedule).length > 0 ? workSchedule : undefined,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {/* Rates Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Ставки оплаты</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="ratePerHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ставка за час</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ratePerLinearMeter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ставка за погонный метр</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ratePerM2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ставка за м²</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Work Types Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Типы работ</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ value: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить тип работ
            </Button>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`workTypes.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Например: Плитка, Штукатурка" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-slate-500">Нет добавленных типов работ</p>
            )}
          </div>
        </div>

        {/* Work Schedule Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Рабочее расписание</h3>
          <div className="space-y-3">
            {DAYS.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-1 gap-3 sm:grid-cols-[150px_1fr_1fr]">
                <div className="flex items-center text-sm font-medium text-slate-700">
                  {label}
                </div>
                <FormField
                  control={form.control}
                  name={`workSchedule.${key}.start`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" placeholder="09:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workSchedule.${key}.end`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" placeholder="18:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          )}
          <Button type="submit" disabled={updateRatesMutation.isPending}>
            {updateRatesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
}
