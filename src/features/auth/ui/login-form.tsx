"use client";

import { useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { env } from "@/env";
import { useLogin } from "@/features/auth/hooks";
import { type LoginSchemaType, loginSchema } from "@/features/auth/schemas";

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

export function LoginForm() {
  const [recaptcha, setRecaptcha] = useState<string | null>(null);
  const [isShowCode, setIsShowCode] = useState(false);

  const { login, isLoginPending } = useLogin(setIsShowCode);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "a.creatuse@gmail.com",
      password: "MyPass123!",
      token: "",
    },
  });

  const onSubmit = (values: LoginSchemaType) => {
    if (!recaptcha) {
      toast.error("Please verify you are human");
      return;
    }

    login({ values, recaptcha });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isShowCode && (
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoginPending}
                    placeholder="Enter the code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isShowCode && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoginPending}
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/auth/reset"
                      className="text-xs hover:underline text-muted-foreground">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      disabled={isLoginPending}
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex items-center justify-center">
          <ReCAPTCHA
            sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={setRecaptcha}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoginPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}
