"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Key } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  type SettingsSchemaType,
  settingsSchema,
} from "@/features/user/schemas";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from "@/shared/ui";
import { useProfile } from "@/shared/hooks";
import { useUpdateProfile } from "@/features/user/hooks";

export function SettingsForm() {
  const { user } = useProfile();
  const { updateProfile, isPending } = useUpdateProfile();

  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(settingsSchema),
    values: {
      displayName: user?.displayName ?? "",
      email: user?.email ?? "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
  });

  const onSubmit = async (values: SettingsSchemaType) => {
    updateProfile(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter your display name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
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
                    disabled={isPending}
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll use this email for account notifications and security
                  alerts.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isTwoFactorEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2 text-base">
                  <Key className="h-4 w-4" />
                  Two-Factor Authentication
                </FormLabel>
                <FormDescription>
                  Add an extra layer of security to your account.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={isPending}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
