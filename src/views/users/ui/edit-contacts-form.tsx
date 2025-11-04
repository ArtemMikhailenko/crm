"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import {
  useUserContacts,
  useCreateUserContact,
  useUpdateUserContact,
  useDeleteUserContact
} from "@/shared/hooks/useUsers";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import type { UserContact } from "@/shared/types/user";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  relation: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export type ContactSchema = z.infer<typeof contactSchema>;

type Props = {
  userId: string;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function EditContactsForm({ userId, onCancel, onSuccess }: Props) {
  const { data: contactsData, isLoading } = useUserContacts(userId);
  const createContactMutation = useCreateUserContact();
  const updateContactMutation = useUpdateUserContact();
  const deleteContactMutation = useDeleteUserContact();
  
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      relation: "",
      isPrimary: false,
    },
  });

  const onSubmit = async (values: ContactSchema) => {
    try {
      if (editingContactId) {
        // Update existing contact
        await updateContactMutation.mutateAsync({
          contactId: editingContactId,
          userId,
          name: values.name,
          phone: values.phone || undefined,
          email: values.email || undefined,
          relation: values.relation || undefined,
          isPrimary: values.isPrimary,
        });
        setEditingContactId(null);
      } else {
        // Create new contact
        await createContactMutation.mutateAsync({
          userId,
          name: values.name,
          phone: values.phone || undefined,
          email: values.email || undefined,
          relation: values.relation || undefined,
          isPrimary: values.isPrimary,
        });
        setIsAdding(false);
      }
      form.reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEdit = (contact: UserContact) => {
    setEditingContactId(contact.id);
    setIsAdding(false);
    form.reset({
      name: contact.name,
      phone: contact.phone || "",
      email: contact.email || "",
      relation: contact.relation || "",
      isPrimary: contact.isPrimary || false,
    });
  };

  const handleDelete = async (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContactMutation.mutateAsync({ contactId, userId });
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleCancel = () => {
    setEditingContactId(null);
    setIsAdding(false);
    form.reset({
      name: "",
      phone: "",
      email: "",
      relation: "",
      isPrimary: false,
    });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingContactId(null);
    form.reset({
      name: "",
      phone: "",
      email: "",
      relation: "",
      isPrimary: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const contacts = contactsData || [];

  return (
    <div className="space-y-4">
      {/* Existing Contacts List */}
      <div className="space-y-3">
        {contacts.map((contact: UserContact) => (
          <div
            key={contact.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            {editingContactId === contact.id ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder="Имя контакта" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон</FormLabel>
                          <FormControl>
                            <Input placeholder="+380 (50) 123-4567" {...field} />
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
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Отношение</FormLabel>
                        <FormControl>
                          <Input placeholder="Друг, Родственник, Коллега" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel className="text-base">Основной контакт</FormLabel>
                          <p className="text-sm text-slate-500">Установить как основной</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                      Отмена
                    </Button>
                    <Button type="submit" size="sm" disabled={updateContactMutation.isPending}>
                      {updateContactMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Сохранить
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900">{contact.name}</div>
                    {contact.isPrimary && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  {contact.relation && (
                    <div className="text-sm text-slate-500">{contact.relation}</div>
                  )}
                  {contact.phone && (
                    <div className="text-sm text-slate-600">{contact.phone}</div>
                  )}
                  {contact.email && (
                    <div className="text-sm text-slate-600">{contact.email}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleteContactMutation.isPending}
                  >
                    {deleteContactMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Contact Form */}
      {isAdding ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="font-medium text-slate-900">Добавить новый контакт</h4>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Имя контакта" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+380 (50) 123-4567" {...field} />
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
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отношение</FormLabel>
                  <FormControl>
                    <Input placeholder="Друг, Родственник, Коллега" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-base">Основной контакт</FormLabel>
                    <p className="text-sm text-slate-500">Установить как основной</p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                Отмена
              </Button>
              <Button type="submit" size="sm" disabled={createContactMutation.isPending}>
                {createContactMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Добавить контакт
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddNew}
          disabled={editingContactId !== null}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить новый контакт
        </Button>
      )}

      {/* Bottom Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Закрыть
          </Button>
        )}
      </div>
    </div>
  );
}
