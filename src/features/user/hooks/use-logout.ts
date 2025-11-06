import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";

import { authService } from "@/features/auth/services";

export function useLogout() {
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Очищаем токен из localStorage
      localStorage.removeItem('authToken');
      
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: () => {
      // Даже при ошибке API очищаем токен локально
      localStorage.removeItem('authToken');
      
      toast.error("Failed to logout");
      router.push("/auth/login");
    },
  });

  return { logout, isPending };
}
