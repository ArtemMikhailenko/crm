"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { env } from "@/env";

import { useResetPassword } from "@/features/auth/hooks";
import { RecoverySchemaType, recoverySchema } from "@/features/auth/schemas";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/ui";

export function ResetPasswordForm() {
  const { resetPassword, isResetPasswordPending } = useResetPassword();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);

  const form = useForm<RecoverySchemaType>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: RecoverySchemaType) => {
    try {
      if (typeof window !== "undefined" && (window as any).grecaptcha && captchaReady) {
        const grecaptcha = (window as any).grecaptcha;
        const token = await grecaptcha.execute(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "reset_password" });
        setCaptchaToken(token);
        resetPassword({ ...values, recaptcha: token });
      } else {
        resetPassword(values);
      }
    } catch {
      resetPassword(values);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = setInterval(() => {
      if ((window as any).grecaptcha?.ready) {
        (window as any).grecaptcha.ready(() => setCaptchaReady(true));
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isResetPasswordPending}
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-1">
          <span className="text-[10px] text-muted-foreground">
            {captchaReady ? "reCAPTCHA защищено" : "Загрузка reCAPTCHA..."}
          </span>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isResetPasswordPending}>
          Reset Password
        </Button>
      </form>
    </Form>
  );
}
