"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useUpdateUser } from "@/shared/hooks/useUsers";
import { useCompanies } from "@/shared/hooks/useCompanies";
import { Loader2 } from "lucide-react";
import type { User } from "@/shared/types/user";

const editUserSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  companyId: z.string().optional(),
  description: z.string().optional(),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;

type Props = {
  user: User;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function EditUserForm({ user, onCancel, onSuccess }: Props) {
  const updateUserMutation = useUpdateUser();
  const { data: companiesData } = useCompanies({ type: 'SUBCONTRACTOR' });

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      displayName: user.displayName,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      companyId: user.company?.id || "",
      description: user.description || "",
    },
  });

  const onSubmit = async (values: EditUserSchema) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        displayName: values.displayName,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || undefined,
        companyId: values.companyId || undefined,
        description: values.description || undefined,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-md border border-muted bg-muted/30 p-3">
          <FormLabel className="text-muted-foreground">Email</FormLabel>
          <p className="mt-1 text-sm font-medium">{user.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  placeholder="Enter user description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (optional)</FormLabel>
              <FormControl>
                <select
                  className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  {...field}
                >
                  <option value="">No company</option>
                  {companiesData?.companies?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
