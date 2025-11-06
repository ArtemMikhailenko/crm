import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/features/auth/services";
import { authToken } from "@/shared/utils";

export function useLogout() {
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Очищаем токен из localStorage
      authToken.remove();
      
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: () => {
      // Даже при ошибке API очищаем токен локально
      authToken.remove();
      
      toast.error("Failed to logout");
      router.push("/auth/login");
    },
  });

  return { logout, isPending };
}
