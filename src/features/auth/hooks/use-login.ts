import { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { LoginSchemaType } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services";

import { toastMessageHandler } from "@/shared/utils";

export const useLogin = (setIsShowCode: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter();
  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ values }: { values: LoginSchemaType }) => {
      return authService.login(values);
    },
    onSuccess: (data: any) => {
      if (data.message) {
        toast.info("Token sent to email.", {
          description: "Please check your email for the token",
        });
        setIsShowCode(true);
      } else {
        // Устанавливаем токен в localStorage после успешного логина
        if (data.data?.accessToken || data.data?.token) {
          localStorage.setItem('authToken', data.data.accessToken || data.data.token);
        }
        
        toast.success("Login successful");
        router.push("/dashboard");
      }
    },
    onError: error => {
      console.log(error);
      toastMessageHandler(error);
    },
  });

  return { login, isLoginPending };
};
