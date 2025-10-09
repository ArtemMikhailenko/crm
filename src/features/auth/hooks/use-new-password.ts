import { useRouter, useSearchParams } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { NewPasswordSchemaType } from "@/features/auth/schemas";
import { recoveryService } from "@/features/auth/services";

import { toastMessageHandler } from "@/shared/utils";

export const useNewPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;
  const router = useRouter();

  const { mutate: newPassword, isPending: isNewPasswordPending } = useMutation({
    mutationKey: ["newPassword"],
    mutationFn: (values: NewPasswordSchemaType) => {
      return recoveryService.newPassword(values, token!);
    },
    onSuccess: (data: any) => {
      if (data.message) {
        toastMessageHandler(data.message);
      } else {
        toast.success("Password updated successfully", {
          description: "Your password has been updated successfully",
        });

        router.push("/auth/login");
      }
    },
    onError: error => {
      console.log(error);
      toastMessageHandler(error);
    },
  });

  return { newPassword, isNewPasswordPending };
};
