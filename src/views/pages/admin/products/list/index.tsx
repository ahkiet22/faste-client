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
import { getAdminProducts, updateProductStatus } from '@/services/admin-product';
import { TAdminProduct } from '@/types/admin/product';
import { formatCurrency } from '@/helpers/currency';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Ban, CheckCircle, Eye, Package, Store, Tag } from 'lucide-react';
import Image from 'next/image';

const TAB_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PUBLISHED', label: 'Đang bán' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'BANNED', label: 'Đã khóa' },
];

export default function AdminProductListPage() {
  const [selectedTab, setSelectedTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsData, setProductsData] = useState<TAdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 10;

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminProducts();
      if (res.status === 'error') {
        toastify.error('Lỗi', res.message || 'Không thể lấy dữ liệu sản phẩm');
      } else {
        const data = res.data?.data || res.data || [];
        setProductsData(data);
      }
    } catch (error) {
      console.error(error);
      toastify.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...productsData];

    if (selectedTab !== 'ALL') {
      filtered = filtered.filter((p) => p.status === selectedTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shop.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    }

    return filtered;
  }, [selectedTab, searchQuery, productsData]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-500">Đang bán</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500 text-white">Chờ duyệt</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Nháp</Badge>;
      case 'BANNED':
        return <Badge variant="destructive">Đã khóa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Icon icon="ph:package" className="text-3xl text-gray-700" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Quản lý sản phẩm
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <Input
            placeholder="Tìm theo tên sản phẩm, gian hàng, ID..."
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
          <div className="hidden lg:block rounded-lg border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[300px]">Sản phẩm</TableHead>
                  <TableHead>Gian hàng</TableHead>
                  <TableHead>Giá gốc</TableHead>
                  <TableHead>Kho / Bán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      Đang tải danh sách sản phẩm...
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((p) => (
                    <TableRow key={p.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-500 text-xs">#{p.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg border overflow-hidden flex-shrink-0 bg-gray-50">
                             <Image 
                                src={p.images?.[0] || '/placeholder-product.png'} 
                                fill 
                                alt={p.name} 
                                className="object-cover"
                             />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm truncate max-w-[250px]">{p.name}</span>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                               <Tag className="w-3 h-3" />
                               {p.categories?.[0]?.name || 'Chưa phân loại'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Store className="w-4 h-4 text-primary" />
                            <span className="font-medium">{p?.shop?.name}</span>
                         </div>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        {formatCurrency(p.basePrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                           <span className="text-gray-500">Kho: <b className="text-gray-700">{p.stock || 0}</b></span>
                           <span className="text-gray-500">Đã bán: <b className="text-gray-700">{p.totalSales || 0}</b></span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            {p.status === 'PENDING' && (
                               <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" /> Duyệt sản phẩm
                               </DropdownMenuItem>
                            )}
                            {p.status !== 'BANNED' ? (
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Ban className="mr-2 h-4 w-4" /> Gỡ / Khóa sản phẩm
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" /> Mở lại sản phẩm
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

          <div className="lg:hidden space-y-4">
             {paginatedProducts.map((p) => (
                <Card key={p.id} className="shadow-sm overflow-hidden border-none ring-1 ring-gray-100">
                   <div className="flex p-3 gap-3">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                         <Image 
                            src={p.images?.[0] || '/placeholder-product.png'} 
                            fill 
                            alt={p.name} 
                            className="object-cover"
                         />
                      </div>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                         <div>
                            <div className="flex justify-between items-start gap-2">
                               <h3 className="text-sm font-bold line-clamp-1">{p.name}</h3>
                               {getStatusBadge(p.status)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                               <Store className="w-3.5 h-3.5 text-primary" />
                               <span className="truncate">{p?.shop?.name}</span>
                            </div>
                         </div>
                         <div className="flex justify-between items-end">
                            <span className="text-primary font-bold">{formatCurrency(p.basePrice)}</span>
                            <span className="text-[10px] text-gray-400 italic">Kho: {p.stock || 0} | Bán: {p.totalSales || 0}</span>
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 border-t text-xs">
                      <Button variant="ghost" className="rounded-none border-r py-2 h-auto text-gray-600">
                         <Eye className="w-3.5 h-3.5 mr-1.5" /> Chi tiết
                      </Button>
                      <Button variant="ghost" className="rounded-none py-2 h-auto text-red-500 hover:text-red-600 hover:bg-red-50">
                         <Ban className="w-3.5 h-3.5 mr-1.5" /> Thao tác
                      </Button>
                   </div>
                </Card>
             ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredProducts.length > 0 && (
         <div className="pt-4 flex w-full justify-center">
             <PaginationWithLinks
               page={currentPage}
               pageSize={pageSize}
               totalCount={filteredProducts.length}
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
