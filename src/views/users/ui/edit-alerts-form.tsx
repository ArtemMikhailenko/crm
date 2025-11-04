"use client";

import { useUserAlertSettings, useUpdateUserAlertSettings } from "@/shared/hooks/useUsers";
import { Switch } from "@/shared/ui/switch";
import { Loader2 } from "lucide-react";
import type { UserAlertSetting } from "@/shared/types/user";

type Props = {
  userId: string;
};

// Определяем доступные типы и категории
const ALERT_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
];

const ALERT_CATEGORIES = [
  { value: 'vacation', label: 'Отпуска' },
  { value: 'timesheet', label: 'Табель' },
  { value: 'schedule', label: 'Расписание' },
  { value: 'tasks', label: 'Задачи' },
];

export function EditAlertsForm({ userId }: Props) {
  const { data: alertSettings, isLoading } = useUserAlertSettings(userId);
  const updateAlertMutation = useUpdateUserAlertSettings();

  const handleToggle = async (alertType: string, category: string, currentValue: boolean) => {
    try {
      await updateAlertMutation.mutateAsync({
        userId,
        alertType,
        category,
        isEnabled: !currentValue,
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Функция для получения состояния конкретной настройки
  const getAlertState = (alertType: string, category: string): boolean => {
    if (!alertSettings) return false;
    const setting = alertSettings.find(
      (s: UserAlertSetting) => s.alertType === alertType && s.category === category
    );
    return setting?.isEnabled || false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-600">
        Настройте типы уведомлений для различных событий
      </div>

      <div className="space-y-4">
        {ALERT_CATEGORIES.map((category) => (
          <div key={category.value} className="rounded-lg border p-4">
            <h4 className="mb-3 font-medium text-slate-900">{category.label}</h4>
            <div className="space-y-3">
              {ALERT_TYPES.map((type) => {
                const isEnabled = getAlertState(type.value, category.value);
                const isUpdating = updateAlertMutation.isPending;
                
                return (
                  <div
                    key={`${type.value}-${category.value}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-700">{type.label}</div>
                      {isUpdating && (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      )}
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggle(type.value, category.value, isEnabled)}
                      disabled={isUpdating}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <strong>Примечание:</strong> Изменения сохраняются автоматически при переключении
      </div>
    </div>
  );
}
