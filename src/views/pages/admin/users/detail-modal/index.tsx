'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getAdminUserById } from '@/services/admin-user';
import { TAdminUser } from '@/types/admin/user';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@iconify/react/dist/iconify.js';
import dayjs from 'dayjs';
import { Separator } from '@/components/ui/separator';

export default function UserDetailModal({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<TAdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getAdminUserById(id);
        setUser(res.data || res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleClose = () => {
    router.back();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 hover:bg-green-600">Hoạt động</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Chưa kích hoạt</Badge>;
      case 'BANNED':
        return <Badge variant="destructive">Đã khóa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
        <div className="bg-primary/5 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon icon="ph:user-circle-fill" className="text-primary text-3xl" />
              Chi tiết người dùng
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {Array(6).fill(0).map((_, i) => (
                   <div key={i} className="space-y-2">
                     <Skeleton className="h-3 w-24" />
                     <Skeleton className="h-5 w-full" />
                   </div>
                 ))}
              </div>
            </div>
          ) : user ? (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-1 ring-border">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground leading-tight">{user.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Mã ID: #{user.id}</p>
                    <div className="mt-3 flex gap-2">
                       {getStatusBadge(user.status)}
                       <Badge variant="outline" className="bg-gray-50 uppercase tracking-wider text-[10px]">
                         {user.role?.name || 'CLIENT'}
                       </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <Icon icon="ph:envelope-simple-bold" />
                     </div>
                     <p className="text-foreground font-medium break-all">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-purple-500/10 p-2 rounded-lg text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                        <Icon icon="ph:phone-bold" />
                     </div>
                     <p className="text-foreground font-medium">{user.phoneNumber || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Giới tính</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-orange-500/10 p-2 rounded-lg text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                        <Icon icon="ph:gender-intersex-bold" />
                     </div>
                     <p className="text-foreground font-medium">
                       {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                     </p>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ngày sinh</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-pink-500/10 p-2 rounded-lg text-pink-600 dark:text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                        <Icon icon="ph:cake-bold" />
                     </div>
                     <p className="text-foreground font-medium">
                       {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                     </p>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vai trò</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                        <Icon icon="ph:shield-chevron-bold" />
                     </div>
                     <p className="text-foreground font-medium lowercase first-letter:uppercase">
                       {user.role?.name || 'CLIENT'}
                     </p>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ngày đăng ký</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-green-500/10 p-2 rounded-lg text-green-600 dark:text-green-400 group-hover:bg-green-500/20 transition-colors">
                        <Icon icon="ph:calendar-blank-bold" />
                     </div>
                     <p className="text-foreground font-medium">
                       {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}
                     </p>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cập nhật lần cuối</p>
                  <div className="flex items-center gap-3">
                     <div className="bg-gray-500/10 p-2 rounded-lg text-gray-600 dark:text-gray-400 group-hover:bg-gray-500/20 transition-colors">
                        <Icon icon="ph:clock-bold" />
                     </div>
                     <p className="text-foreground font-medium">
                       {dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm')}
                     </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border flex items-start gap-3">
                 <Icon icon="ph:info-bold" className="text-muted-foreground text-xl mt-0.5" />
                 <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Tài khoản được khởi tạo thông qua hệ thống đăng ký người dùng mặc định. 
                    Mọi thay đổi về trạng thái sẽ được ghi lại trong nhật ký hệ thống.
                 </p>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <Icon icon="ph:user-minus-bold" className="text-5xl text-gray-300 mx-auto" />
              <p className="text-gray-500 font-medium">Không tìm thấy thông tin người dùng</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
