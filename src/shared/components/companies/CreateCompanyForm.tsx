import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateCompany } from '../../hooks/useCompanies'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Loader2 } from 'lucide-react'
import type { CreateCompanyRequest } from '../../types/company'

const createCompanySchema = z.object({
  name: z.string().min(1, 'Название компании обязательно'),
  type: z.enum(['CUSTOMER', 'SUBCONTRACTOR'], {
    required_error: 'Тип компании обязателен',
  }),
  description: z.string().optional(),
  website: z.string().url('Неверный формат URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  vatNumber: z.string().optional(),
})

type CreateCompanyFormData = z.infer<typeof createCompanySchema>

interface CreateCompanyFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreateCompanyForm: React.FC<CreateCompanyFormProps> = ({ onSuccess, onCancel }) => {
  const createCompanyMutation = useCreateCompany()

  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      type: 'SUBCONTRACTOR',
      description: '',
      website: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Украина',
      vatNumber: '',
    },
  })

  const onSubmit = async (data: CreateCompanyFormData) => {
    try {
      const companyData: CreateCompanyRequest = {
        ...data,
        website: data.website || undefined,
      }
      await createCompanyMutation.mutateAsync(companyData)
      onSuccess?.()
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название компании *</FormLabel>
              <FormControl>
                <Input placeholder="ООО Стройкомпания" {...field} />
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
              <FormLabel>Тип компании *</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="SUBCONTRACTOR">Субподрядчик</option>
                  <option value="CUSTOMER">Заказчик</option>
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
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Краткое описание деятельности компании"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Веб-сайт</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>НДС номер</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Input placeholder="ул. Примерная, д. 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Город</FormLabel>
                <FormControl>
                  <Input placeholder="Киев" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Почтовый индекс</FormLabel>
                <FormControl>
                  <Input placeholder="01001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Страна</FormLabel>
                <FormControl>
                  <Input placeholder="Украина" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createCompanyMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={createCompanyMutation.isPending}
          >
            {createCompanyMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Создать компанию
          </Button>
        </div>
      </form>
    </Form>
  )
}