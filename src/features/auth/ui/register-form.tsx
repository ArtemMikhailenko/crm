"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { env } from "@/env";
import { useRegister } from "@/features/auth/hooks";
import {
  type RegisterSchemaType,
  registerSchema,
} from "@/features/auth/schemas";

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
  const [recaptcha, setRecaptcha] = useState<string | null>(null);
  const { register, isRegisterPending } = useRegister();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "asdasd",
      email: "a.creatuse@gmail.com",
      password: "MyPass123!",
      passwordRepeat: "MyPass123!",
    },
  });

  const onSubmit = (values: RegisterSchemaType) => {
    if (!recaptcha) {
      toast.error("Please verify you are human");
      return;
    }

    register({ values, recaptcha });
  };

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
        <div className="flex items-center justify-center">
          <ReCAPTCHA
            sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={setRecaptcha}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isRegisterPending}>
          Register
        </Button>
      </form>
    </Form>
  );
}
