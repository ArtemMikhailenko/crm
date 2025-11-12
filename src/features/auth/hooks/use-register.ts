import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RegisterSchemaType } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services";

import { toastMessageHandler } from "@/shared/utils";

export const useRegister = () => {
  const router = useRouter();
  const { mutate: register, isPending: isRegisterPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: ({ values }: { values: RegisterSchemaType }) => {
      return authService.register(values);
    },
    onSuccess: () => {
      // После успешной регистрации перенаправляем на страницу логина
      // и не сохраняем токен, чтобы пользователь залогинился вручную
      toast.success("User registered successfully", {
        description: "Now you can log in",
      });
      router.push("/auth/login");
    },
    onError: error => {
      console.log(error);
      toastMessageHandler(error);
    },
  });

  return { register, isRegisterPending };
};
