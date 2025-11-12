"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// Switch to reCAPTCHA v3 (invisible) – remove component
import { useRegister } from "@/features/auth/hooks";
import {
  type RegisterSchemaType,
  registerSchema,
} from "@/features/auth/schemas";
import { env } from "@/env";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@/shared/ui";

export function RegisterForm() {
  const { register, isRegisterPending } = useRegister();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  });

  const onSubmit = async (values: RegisterSchemaType) => {
    try {
      if (typeof window !== "undefined" && (window as any).grecaptcha && captchaReady) {
        const grecaptcha = (window as any).grecaptcha;
        const token = await grecaptcha.execute(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "register" });
        setCaptchaToken(token);
        register({ values: { ...values, recaptcha: token } });
      } else {
        register({ values });
      }
    } catch {
      register({ values });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isRegisterPending}
                  placeholder="Enter your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isRegisterPending}
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={isRegisterPending}
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordRepeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={isRegisterPending}
                  placeholder="Confirm your password"
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

        <Button type="submit" className="w-full" disabled={isRegisterPending}>
          Register
        </Button>
      </form>
    </Form>
  );
}
