import { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { LoginSchemaType } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services";

import { toastMessageHandler, authToken } from "@/shared/utils";

export const useLogin = (setIsShowCode: Dispatch<SetStateAction<boolean>>) => {
  const router = useRouter();
  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ values }: { values: LoginSchemaType }) => {
      return authService.login(values);
    },
    onSuccess: (data: any) => {
      console.log("Login response:", data);
      console.log("Login response structure:", JSON.stringify(data, null, 2));
      
      if (data.message) {
        toast.info("Token sent to email.", {
          description: "Please check your email for the token",
        });
        setIsShowCode(true);
      } else {
        // Устанавливаем токен в localStorage после успешного логина
        const token = data.accessToken || data.data?.accessToken || data.token || data.data?.token;
        
        if (token) {
          console.log("Saving token to localStorage:", token);
          authToken.set(token);
        } else {
          console.error("No token found in response:", data);
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
