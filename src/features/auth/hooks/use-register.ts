import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RegisterSchemaType } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services";

import { toastMessageHandler } from "@/shared/utils";

export const useRegister = () => {
  const { mutate: register, isPending: isRegisterPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: ({ values }: { values: RegisterSchemaType }) => {
      return authService.register(values);
    },
    onSuccess: (data: any) => {
      // Устанавливаем токен в localStorage после успешной регистрации (если есть)
      if (data.data?.accessToken || data.data?.token) {
        localStorage.setItem('authToken', data.data.accessToken || data.data.token);
      }
      
      toast.success("User registered successfully", {
        description: "Please check your email for verification",
      });
    },
    onError: error => {
      console.log(error);
      toastMessageHandler(error);
    },
  });

  return { register, isRegisterPending };
};
