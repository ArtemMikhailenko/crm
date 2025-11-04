"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useCreateCompany } from "@/shared/hooks/useCompanies";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const addCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  type: z.enum(['CUSTOMER', 'SUBCONTRACTOR'], {
    required_error: 'Company type is required',
  }),
  description: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
});

export type AddCompanySchema = z.infer<typeof addCompanySchema>;

type Props = {
  onCancel?: () => void;
  onSuccess?: (data: AddCompanySchema) => void;
};

export function AddCompanyForm({ onCancel, onSuccess }: Props) {
  const createCompanyMutation = useCreateCompany();

  const form = useForm<AddCompanySchema>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: { 
      name: "", 
      type: "SUBCONTRACTOR",
      description: "",
      website: "",
      phone: "", 
      email: "" 
    },
  });

  const onSubmit = async (values: AddCompanySchema) => {
    try {
      await createCompanyMutation.mutateAsync({
        name: values.name,
        type: values.type,
        description: values.description || undefined,
        website: values.website || undefined,
      });
      onSuccess?.(values);
      form.reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Apple Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company type</FormLabel>
              <FormControl>
                <select
                  className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  {...field}
                >
                  <option value="SUBCONTRACTOR">Subcontractor</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Brief description of company activities"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(217) 555-0113" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createCompanyMutation.isPending}>
            {createCompanyMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add company
          </Button>
        </div>
      </form>
    </Form>
  );
}