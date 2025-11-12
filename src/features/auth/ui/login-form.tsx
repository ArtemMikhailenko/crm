"use client";

import { useEffect, useRef, useState } from "react";
// For v3 we won't render a visible widget; remove v2 component usage

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "@/features/auth/hooks";
import { authService } from "@/features/auth/services";
import { type LoginSchemaType, loginSchema } from "@/features/auth/schemas";
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

export function LoginForm() {
  const [isShowCode, setIsShowCode] = useState(false);
  const [ttlMinutes, setTtlMinutes] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { login, isLoginPending } = useLogin(setIsShowCode, setTtlMinutes);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      token: "",
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    // Remove empty token field if not provided
    const payload: any = {
      email: values.email,
      password: values.password,
    };
    
    // Only add token if it has a value
    if (values.token && values.token.trim()) {
      payload.token = values.token;
    }

    // Execute reCAPTCHA v3 action before login
    try {
      if (typeof window !== "undefined" && (window as any).grecaptcha && captchaReady) {
        const grecaptcha = (window as any).grecaptcha;
        const recaptchaToken = await grecaptcha.execute(env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "login" });
        setCaptchaToken(recaptchaToken);
        login({ values: { ...payload, recaptcha: recaptchaToken } });
      } else {
        // Fallback: proceed without recaptcha
        login({ values: payload });
      }
    } catch (e) {
      login({ values: payload });
    }
  };

  // Prepare grecaptcha
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

  // focus OTP input when shown
  useEffect(() => {
    if (isShowCode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowCode]);

  // setup ttl countdown (for display only) and resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (ttlMinutes) {
      const exp = Date.now() + ttlMinutes * 60 * 1000;
      setExpiresAt(exp);
      // initial resend cooldown (server controls exact interval; we default to 60s)
      if (resendCooldown <= 0) setResendCooldown(60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ttlMinutes]);

  // timers ticking: token expiry and resend cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      // resend cooldown tick
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      // token expiry tick
      if (expiresAt) {
        const left = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setTimeLeftSec(left);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [expiresAt]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const email = form.getValues("email");
    try {
      const res = await authService.resendTwoFactor({ email });
      // restart cooldown
      setResendCooldown(60);
      // reset token expiry countdown using last known ttl or default 10 minutes
      setExpiresAt(Date.now() + (ttlMinutes ?? 10) * 60 * 1000);
      // Provide feedback
      // using toastMessageHandler is for errors; success we show simple toast
      // dynamic import to avoid circular
      const { toast } = await import("sonner");
      toast.success(res.message || "Code resent");
    } catch (e: any) {
      const { toast } = await import("sonner");
      // If server returns message with remaining seconds, parse it (e.g., "Please wait 42 seconds")
      const msg: string = e.message || "Resend failed";
      const secMatch = msg.match(/(\d{1,3})\s*sec/);
      if (secMatch) {
        setResendCooldown(parseInt(secMatch[1], 10));
      }
      toast.error(msg);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isShowCode && (
          <>
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Code</FormLabel>
                    {expiresAt && (
                      <span className="text-xs text-muted-foreground">
                        {/* show remaining token life countdown */}
                        Expires in {Math.floor(timeLeftSec / 60)}m {(
                          timeLeftSec % 60
                        )
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      disabled={isLoginPending}
                      placeholder="Enter the 6-digit code"
                      maxLength={6}
                      {...field}
                      ref={el => {
                        // wire up RHF ref and our local ref for autofocus
                        if (field.ref) {
                          // Forward to react-hook-form ref
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          field.ref(el);
                        }
                        inputRef.current = el;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={resendCooldown > 0}
                onClick={handleResend}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"}
              </Button>
              <Button type="submit" size="sm" disabled={isLoginPending}>
                Verify & Login
              </Button>
            </div>
          </>
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
            {/* reCAPTCHA v3 is invisible; show status indicator */}
            <div className="flex justify-end pt-1">
              <span className="text-[10px] text-muted-foreground">
                {captchaReady ? "reCAPTCHA защищено" : "Загрузка reCAPTCHA..."}
              </span>
            </div>
          </>
        )}
        {!isShowCode && (
          <Button type="submit" className="w-full" disabled={isLoginPending}>
            Login
          </Button>
        )}
      </form>
    </Form>
  );
}
