'use client';

import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toastify } from '@/components/ToastNotification';
import { PaginationWithLinks } from '@/components/pagination-table';
import { getAdminUsers } from '@/services/admin-user';
import { TAdminUser } from '@/types/admin/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Ban, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TAB_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Chưa kích hoạt' },
  { value: 'BANNED', label: 'Đã khóa' },
];

export default function UserListPage() {
  const [selectedTab, setSelectedTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersData, setUsersData] = useState<TAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const pathname = usePathname();

  const pageSize = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminUsers();
      if (res.status === 'error') {
        toastify.error('Lỗi', res.message || 'Không thể lấy dữ liệu người dùng');
      } else {
        // Mock data logic if api doesn't return list yet
        const data = res.data?.data || res.data || [];
        setUsersData(data);
        setTotalItems(data.length); 
      }
    } catch (error) {
      console.error(error);
      toastify.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = [...usersData];

    if (selectedTab !== 'ALL') {
      filtered = filtered.filter((user) => user.status === selectedTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phoneNumber?.includes(query) ||
          user.id.toString().includes(query)
      );
    }

    return filtered;
  }, [selectedTab, searchQuery, usersData]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setCurrentPage(1);
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
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Icon icon="ph:users" className="text-3xl text-muted-foreground" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Danh sách người dùng
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl"
          />
          <Input
            placeholder="Tìm theo mã ID, tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex-wrap h-auto justify-start gap-2 bg-background/50 py-2">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="hidden md:block rounded-lg border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Thông tin liên hệ</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Đang tải danh sách người dùng...
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">#{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.email}</span>
                          <span className="text-xs text-muted-foreground">{user.phoneNumber || 'Chưa cập nhật'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.createdAt ? dayjs(user.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status || 'ACTIVE')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/admin/users/detail/${user.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            {user.status !== 'BANNED' ? (
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Ban className="mr-2 h-4 w-4" /> Khóa tài khoản
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" /> Mở khóa
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {isLoading ? (
               <Card>
                 <CardContent className="flex flex-col items-center justify-center py-12">
                   <p className="text-gray-500">Đang tải danh sách người dùng...</p>
                 </CardContent>
               </Card>
            ) : paginatedUsers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Icon icon="ph:users" className="text-5xl text-gray-300 mb-3" />
                  <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                </CardContent>
              </Card>
            ) : (
              paginatedUsers.map((user) => (
                <Card key={user.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{user.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">ID: #{user.id}</p>
                        </div>
                      </div>
                      {getStatusBadge(user.status || 'ACTIVE')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground/80">
                      <strong className="text-foreground">Email:</strong> {user.email}
                    </div>
                    <div className="text-sm text-muted-foreground/80">
                      <strong className="text-foreground">SĐT:</strong> {user.phoneNumber || 'Chưa cập nhật'}
                    </div>
                    <div className="text-sm text-muted-foreground/80">
                      <strong className="text-foreground">Đăng ký:</strong> {user.createdAt ? dayjs(user.createdAt).format('DD/MM/YYYY') : 'N/A'}
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" className="flex-1" asChild>
                          <Link href={`/admin/users/detail/${user.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> Chi tiết
                          </Link>
                       </Button>
                       {user.status !== 'BANNED' ? (
                          <Button variant="destructive" className="flex-1">
                             <Ban className="mr-2 h-4 w-4" /> Khóa
                          </Button>
                       ) : (
                          <Button variant="default" className="flex-1 bg-green-600 hover:bg-green-700">
                             <CheckCircle className="mr-2 h-4 w-4" /> Mở khóa
                          </Button>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {filteredUsers.length > 0 && (
         <div className="pt-4 flex w-full justify-center">
             <PaginationWithLinks
               page={currentPage}
               pageSize={pageSize}
               totalCount={filteredUsers.length}
               pageSizeSelectOptions={{
                   pageSizeOptions: [10, 20, 50],
                   pageSizeSearchParam: 'limit'
               }}
             />
         </div>
      )}
    </div>
  );
}
