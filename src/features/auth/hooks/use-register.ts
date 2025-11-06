import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RegisterSchemaType } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services";

import { toastMessageHandler, authToken } from "@/shared/utils";

export const useRegister = () => {
  const router = useRouter();
  const { mutate: register, isPending: isRegisterPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: ({ values }: { values: RegisterSchemaType }) => {
      return authService.register(values);
    },
    onSuccess: (data: any) => {
      console.log("Register response:", data);
      console.log("Register response structure:", JSON.stringify(data, null, 2));
      
      // Устанавливаем токен в localStorage после успешной регистрации (если есть)
      const token = data.accessToken || data.data?.accessToken || data.token || data.data?.token;
      
      if (token) {
        console.log("Saving token to localStorage:", token);
        authToken.set(token);
      } else {
        console.log("No token found in registration response");
      }
      
      toast.success("User registered successfully", {
        description: "Please check your email for verification",
      });
      
      // Редирект на dashboard
      router.push("/dashboard");
    },
    onError: error => {
      console.log(error);
      toastMessageHandler(error);
    },
  });

  return { register, isRegisterPending };
};
