import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { userService } from "@/features/user/services";

export const useToggle2FA = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutate: toggle2FA, isPending } = useMutation({
    mutationFn: (enabled: boolean) => userService.toggle2FA(userId, enabled),
    onSuccess: (data, enabled) => {
      toast.success(
        enabled
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled"
      );
      // Invalidate profile query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update 2FA settings");
    },
  });

  return {
    toggle2FA,
    isPending,
  };
};
