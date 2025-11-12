"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Globe, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  type UpdatePasswordSchemaType,
  updatePasswordSchema,
} from "@/features/user/schemas";

import { useUpdatePassword, useToggle2FA } from "@/features/user/hooks";
import { useProfile } from "@/shared/hooks";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  Separator,
  Switch,
} from "@/shared/ui";

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const { updatePassword, isPending } = useUpdatePassword();
  const { user } = useProfile();
  const { toggle2FA, isPending: is2FAPending } = useToggle2FA(user?.id || "");

  const form = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: UpdatePasswordSchemaType) => {
    updatePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    form.reset();
  };

  const handle2FAToggle = (enabled: boolean) => {
    toggle2FA(enabled);
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-medium">Two-Factor Authentication</span>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Email OTP Verification</p>
              <p className="text-xs text-muted-foreground">
                Require a verification code sent to your email when logging in
              </p>
            </div>
            <Switch
              checked={user?.isTwoFactorEnabled ?? true}
              onCheckedChange={handle2FAToggle}
              disabled={is2FAPending || !user?.id}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Password Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      disabled={isPending}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }>
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter new password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm new password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
      <Separator />
      {/* Active Sessions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="font-medium">Active Sessions</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Session</p>
              <p className="text-xs text-muted-foreground">
                Chrome on macOS • San Francisco, CA
              </p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Mobile App</p>
              <p className="text-xs text-muted-foreground">
                iPhone • Last seen 2 hours ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              Revoke
            </Button>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline">Sign Out All Devices</Button>
      </div>
    </div>
  );
}