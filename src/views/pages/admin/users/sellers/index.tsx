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
import { Icon } from '@iconify/react';
import { toastify } from '@/components/ToastNotification';
import { PaginationWithLinks } from '@/components/pagination-table';
import { getAdminSellers } from '@/services/admin-user';
import { TAdminSeller } from '@/types/admin/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Ban, CheckCircle, Eye, Store } from 'lucide-react';

const TAB_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Chưa kích hoạt' },
  { value: 'BANNED', label: 'Đã khóa' },
];

export default function SellerListPage() {
  const [selectedTab, setSelectedTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sellersData, setSellersData] = useState<TAdminSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 10;

  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminSellers();
      if (res.status === 'error') {
        toastify.error('Lỗi', res.message || 'Không thể lấy dữ liệu người bán');
      } else {
        const data = res.data?.data || res.data || [];
        setSellersData(data);
      }
    } catch (error) {
      console.error(error);
      toastify.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách người bán');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredSellers = useMemo(() => {
    let filtered = [...sellersData];

    if (selectedTab !== 'ALL') {
      filtered = filtered.filter((seller) => seller.status === selectedTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (seller) =>
          seller.name.toLowerCase().includes(query) ||
          seller.email.toLowerCase().includes(query) ||
          seller.shop?.name.toLowerCase().includes(query) ||
          seller.id.toString().includes(query)
      );
    }

    return filtered;
  }, [selectedTab, searchQuery, sellersData]);

  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSellers.slice(startIndex, startIndex + pageSize);
  }, [filteredSellers, currentPage]);

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
        <Icon icon="ph:storefront" className="text-3xl text-gray-700" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Danh sách người bán
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <Input
            placeholder="Tìm theo mã ID, tên, email, tên shop..."
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
        <TabsList className="w-full flex-wrap h-auto justify-start gap-2 bg-white py-2">
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
          <div className="hidden xl:block rounded-lg border bg-white shadow-sm overflow-x-auto">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Cửa hàng (Shop)</TableHead>
                  <TableHead>Sản phẩm/Đơn</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Đang tải danh sách người bán...
                    </TableCell>
                  </TableRow>
                ) : paginatedSellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Không tìm thấy người bán nào
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSellers.map((seller) => (
                    <TableRow key={seller.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">#{seller.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={seller.avatar || undefined} />
                            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{seller.name}</span>
                            <span className="text-xs text-gray-500">{seller.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         {seller.shop ? (
                            <div className="flex items-center gap-2">
                               <Avatar className="w-8 h-8 rounded-md">
                                  <AvatarImage src={seller.shop.logo || undefined} />
                                  <AvatarFallback className="rounded-md"><Store className="w-4 h-4" /></AvatarFallback>
                               </Avatar>
                               <span className="text-sm font-medium">{seller.shop.name}</span>
                            </div>
                         ) : (
                            <span className="text-xs text-gray-500 italic">Chưa tạo shop</span>
                         )}
                      </TableCell>
                      <TableCell>
                         {seller.shop && (
                            <div className="flex flex-col text-sm">
                               <span className="text-blue-600 font-medium">SP: {seller.shop.totalProducts || 0}</span>
                               <span className="text-green-600 font-medium">Đơn: {seller.shop.totalOrders || 0}</span>
                            </div>
                         )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {seller.createdAt ? dayjs(seller.createdAt).format('DD/MM/YYYY') : 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(seller.status || 'ACTIVE')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            {seller.status !== 'BANNED' ? (
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

          <div className="xl:hidden space-y-4">
            {isLoading ? (
               <Card>
                 <CardContent className="flex flex-col items-center justify-center py-12">
                   <p className="text-gray-500">Đang tải danh sách người bán...</p>
                 </CardContent>
               </Card>
            ) : paginatedSellers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Icon icon="ph:storefront" className="text-5xl text-gray-300 mb-3" />
                  <p className="text-gray-500">Không tìm thấy người bán nào</p>
                </CardContent>
              </Card>
            ) : (
              paginatedSellers.map((seller) => (
                <Card key={seller.id} className="shadow-sm">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={seller.avatar || undefined} />
                          <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{seller.name}</CardTitle>
                          <p className="text-xs text-gray-500">{seller.email}</p>
                        </div>
                      </div>
                      {getStatusBadge(seller.status || 'ACTIVE')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                     {seller.shop ? (
                        <>
                           <div className="flex items-center gap-2">
                              <Avatar className="w-10 h-10 rounded-md">
                                 <AvatarImage src={seller.shop.logo || undefined} />
                                 <AvatarFallback className="rounded-md"><Store className="w-5 h-5 text-gray-400" /></AvatarFallback>
                              </Avatar>
                              <div>
                                 <span className="text-sm font-semibold block">{seller.shop.name}</span>
                                 <span className="text-xs text-gray-500">Tạo ngày: {dayjs(seller.shop.createdAt).format('DD/MM/YYYY')}</span>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="bg-blue-50 p-2 rounded-md flex flex-col items-center">
                                 <span className="text-xs text-blue-600">Sản phẩm</span>
                                 <span className="font-bold text-blue-700">{seller.shop.totalProducts}</span>
                              </div>
                              <div className="bg-green-50 p-2 rounded-md flex flex-col items-center">
                                 <span className="text-xs text-green-600">Đơn hàng</span>
                                 <span className="font-bold text-green-700">{seller.shop.totalOrders}</span>
                              </div>
                           </div>
                        </>
                     ) : (
                        <div className="text-center py-3 bg-gray-50 rounded-md">
                           <span className="text-sm text-gray-500 italic">Người dùng chưa tạo shop</span>
                        </div>
                     )}
                    
                    <div className="flex gap-2 pt-2">
                       <Button variant="outline" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" /> Chi tiết
                       </Button>
                       {seller.status !== 'BANNED' ? (
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

      {filteredSellers.length > 0 && (
         <div className="pt-4 flex w-full justify-center">
             <PaginationWithLinks
               page={currentPage}
               pageSize={pageSize}
               totalCount={filteredSellers.length}
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
