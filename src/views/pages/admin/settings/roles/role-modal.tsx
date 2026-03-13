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
import { Switch } from '@/components/ui/switch';
import { TAdminRole, TCreateRoleInput } from '@/types/admin/role';
import { createRole, updateRole } from '@/services/admin-role';
import { toastify } from '@/components/ToastNotification';

const roleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  isActive: z.boolean(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: TAdminRole | null;
}

export function RoleModal({ isOpen, onClose, onSuccess, role }: RoleModalProps) {
  const isEdit = !!role;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        isActive: role.isActive,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [role, form, isOpen]);

  const onSubmit = async (values: RoleFormValues) => {
    try {
      if (isEdit && role) {
        // Since this modal only handles basic info, we preserve existing permissions if any
        // or just update basic info if the API supports it. 
        // Based on user schema, update requires permissionIds.
        // I will handle full update in the main page, this modal might be for basic CU.
        // Actually, let's keep it simple for now and only do create/basic update here.
        await updateRole(role.id, {
            ...values,
            permissionIds: role.permissions?.map(p => p.id) || []
        });
        toastify.success('Thành công', 'Cập nhật vai trò thành công');
      } else {
        await createRole(values);
        toastify.success('Thành công', 'Tạo vai trò mới thành công');
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
            {isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên vai trò</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên vai trò..." {...field} disabled={isEdit && role?.name === 'ADMIN'} />
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
                       placeholder="Nhập mô tả..." 
                       className="resize-none" 
                       {...field} 
                       disabled={isEdit && role?.name === 'ADMIN'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Kích hoạt</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isEdit && role?.name === 'ADMIN'}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || (isEdit && role?.name === 'ADMIN')}
              >
                {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
