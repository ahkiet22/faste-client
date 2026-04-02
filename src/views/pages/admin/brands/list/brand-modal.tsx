'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TAdminBrand, TCreateBrandInput } from '@/types/admin/brand';
import { createBrand, updateBrand } from '@/services/admin-brand';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { toastify } from '@/components/ToastNotification';

const brandSchema = z.object({
  name: z.string().min(1, 'Tên thương hiệu là bắt buộc'),
  description: z.string().optional(),
  logo: z.string().url('URL logo không hợp lệ').optional().or(z.literal('')),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: TAdminBrand | null;
}

export function BrandModal({ isOpen, onClose, onSuccess, brand }: BrandModalProps) {
  const isEdit = !!brand;

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
    },
  });

  const logoUrl = form.watch('logo');
  const isValidUrl = logoUrl && z.string().url().safeParse(logoUrl).success;

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
        logo: brand.logo || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        logo: '',
      });
    }
  }, [brand, form, isOpen]);

  const onSubmit = async (values: BrandFormValues) => {
    try {
      const data: TCreateBrandInput = {
        name: values.name,
        description: values.description || undefined,
        logo: values.logo || undefined,
      };

      if (isEdit && brand) {
        await updateBrand(brand.id, data);
        toastify.success('Thành công', 'Cập nhật thương hiệu thành công');
      } else {
        await createBrand(data);
        toastify.success('Thành công', 'Tạo thương hiệu mới thành công');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toastify.error('Lỗi', error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thương hiệu</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên thương hiệu..." {...field} />
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
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea 
                       placeholder="Nhập mô tả thương hiệu..." 
                       className="resize-none" 
                       {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Logo</FormLabel>
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-md border flex-shrink-0 bg-secondary/20 flex items-center justify-center overflow-hidden">
                       {isValidUrl ? (
                          <Image 
                            src={logoUrl || ''} 
                            alt="Preview" 
                            fill 
                            className="object-contain p-2"
                          />
                       ) : (
                          <Icon icon="ph:image" className="w-8 h-8 text-muted-foreground" />
                       )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                       <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} />
                       </FormControl>
                       <FormMessage className="mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
