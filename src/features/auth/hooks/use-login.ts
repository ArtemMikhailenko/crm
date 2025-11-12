import { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { LoginSchemaType } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services";

import { toastMessageHandler } from "@/shared/utils";

export const useLogin = (
  setIsShowCode: Dispatch<SetStateAction<boolean>>,
  setTtlMinutes: Dispatch<SetStateAction<number | null>>
) => {
  const router = useRouter();
  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ values }: { values: LoginSchemaType }) => {
      console.log("🔵 Login attempt with:", { 
        email: values.email, 
        hasPassword: !!values.password,
        hasToken: !!values.token,
        tokenValue: values.token 
      });
      return authService.login(values);
    },
    onSuccess: (data: any) => {
      console.log("🟢 Login response:", data);
      
      // 2FA required branch
      if (data.twoFactorRequired) {
        console.log("✅ 2FA required - showing code input");
        toast.info("Two-factor authentication required", {
          description: data.message || "Code sent to email",
        });
        setIsShowCode(true);
        setTtlMinutes(data.ttlMinutes);
        return;
      }

      // Successful login branch
      const accessToken = data.accessToken || data.token || data.data?.accessToken || data.data?.token;
      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
      }

      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: error => {
      console.error("🔴 Login error:", error);
      
      // Handle invalid / expired token errors specifically
      if ((error as any)?.message?.toLowerCase().includes("expired")) {
        toast.error("Code expired", {
          description: "Please resend and enter a new code",
        });
      } else if ((error as any)?.message?.toLowerCase().includes("not found")) {
        toast.error("Invalid credentials", {
          description: "Please check your email and password",
        });
      } else {
        toastMessageHandler(error as Error);
      }
    },
  });

  return { login, isLoginPending };
};
