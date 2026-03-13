'use client';

import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TAdminCategory, TCreateCategoryInput } from '@/types/admin/category';
import { createCategory, updateCategory, getAdminCategories } from '@/services/admin-category';
import { toastify } from '@/components/ToastNotification';

const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
  parentCategoryId: z.string().optional().or(z.literal('none')),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: TAdminCategory | null;
}

export function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
  const isEdit = !!category;
  const [categories, setCategories] = useState<TAdminCategory[]>([]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentCategoryId: 'none',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAdminCategories();
        const data = res.data?.data || res.data || [];
        // Filter out current category to prevent self-loop
        setCategories(data.filter((c: TAdminCategory) => c.id !== category?.id));
      } catch (error) {
        console.error(error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, category]);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        parentCategoryId: category.parentCategoryId ? category.parentCategoryId.toString() : 'none',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        parentCategoryId: 'none',
      });
    }
  }, [category, form, isOpen]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      const data: TCreateCategoryInput = {
        name: values.name,
        description: values.description || undefined,
        parentCategoryId: values.parentCategoryId && values.parentCategoryId !== 'none' ? parseInt(values.parentCategoryId) : null,
      };

      if (isEdit && category) {
        await updateCategory(category.id, data);
        toastify.success('Thành công', 'Cập nhật danh mục thành công');
      } else {
        await createCategory(data);
        toastify.success('Thành công', 'Tạo danh mục mới thành công');
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
            {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục..." {...field} />
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
                       placeholder="Nhập mô tả danh mục..." 
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
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục cha</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục cha (Không bắt buộc)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Không có</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
