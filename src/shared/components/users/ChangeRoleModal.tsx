"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/modal";
import { Button, Label } from "@/shared/ui";
import { toast } from "sonner";
import { UsersService } from "@/shared/services/users.service";
import { RolesService, type Role } from "@/shared/services/roles.service";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentRoles?: string[];
  onSuccess?: () => void;
};

export function ChangeRoleModal({ 
  open, 
  onClose, 
  userId, 
  userName,
  currentRoles = [],
  onSuccess 
}: Props) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Load roles when modal opens
  useEffect(() => {
    if (open) {
      setSelectedRoles(currentRoles);
      loadRoles();
    }
  }, [open, currentRoles]);

  const loadRoles = async () => {
    try {
      setIsLoadingRoles(true);
      const data = await RolesService.getRoles();
      setRoles(data);
    } catch (error: any) {
      console.error("Failed to load roles:", error);
      
      // Если 401 - пользователь не авторизован
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500);
        return;
      }
      
      // Для других ошибок показываем сообщение и используем fallback
      toast.warning("Using default roles");
      
      // Fallback to default roles if API fails
      setRoles([
        { id: "admin", name: "Administrator", description: "Full system access" },
        { id: "manager", name: "Manager", description: "Team management" },
        { id: "employee", name: "Employee", description: "Regular employee" },
        { id: "contractor", name: "Contractor", description: "External contractor" },
      ]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    setIsLoading(true);
    try {
      await UsersService.assignRoles(userId, selectedRoles);
      toast.success("Role updated successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to update role:", error);
      
      // Если 401 - сессия истекла
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500);
        return;
      }
      
      // Другие ошибки
      const message = error?.response?.data?.message || error?.message || "Failed to update role";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Change Role - ${userName}`}>
      <div className="space-y-4">
        {isLoadingRoles ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div>
              <Label className="mb-3 block text-sm font-medium">Select Roles</Label>
              <div className="space-y-2">
                {roles.map(role => (
                  <label
                    key={role.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleToggleRole(role.id)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">{role.name}</span>
                      {role.description && (
                        <p className="text-xs text-gray-500">{role.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || selectedRoles.length === 0}
              >
                {isLoading ? "Updating..." : "Update Role"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
