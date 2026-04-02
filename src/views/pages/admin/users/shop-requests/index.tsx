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
import { getShopRequests, handleShopRequest } from '@/services/admin-user';
import { TShopRequest } from '@/types/admin/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check, X, Eye, FileText } from 'lucide-react';
import Image from 'next/image';

const TAB_OPTIONS = [
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
  { value: 'ALL', label: 'Tất cả' },
];

export default function ShopRequestListPage() {
  const [selectedTab, setSelectedTab] = useState<string>('PENDING');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requestsData, setRequestsData] = useState<TShopRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TShopRequest | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pageSize = 10;

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await getShopRequests();
      if (res.status === 'error') {
        toastify.error('Lỗi', res.message || 'Không thể lấy dữ liệu yêu cầu');
      } else {
        const data = res.data?.data || res.data || [];
        setRequestsData(data);
      }
    } catch (error) {
      console.error(error);
      toastify.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách yêu cầu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    let filtered = [...requestsData];

    if (selectedTab !== 'ALL') {
      filtered = filtered.filter((req) => req.status === selectedTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.shopName.toLowerCase().includes(query) ||
          req.user.name.toLowerCase().includes(query) ||
          req.user.email.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [selectedTab, searchQuery, requestsData]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRequests.slice(startIndex, startIndex + pageSize);
  }, [filteredRequests, currentPage]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setCurrentPage(1);
  };

  const onHandleRequest = async (
    id: number,
    status: 'APPROVED' | 'REJECTED',
  ) => {
    try {
      const res = await handleShopRequest(id, status);
      if (res.status === 'success') {
        toastify.success(
          'Thành công',
          `${status === 'APPROVED' ? 'Duyệt' : 'Từ chối'} yêu cầu thành công`,
        );
        fetchRequests();
        setIsDetailOpen(false);
      } else {
        toastify.error('Lỗi', res.message);
      }
    } catch (error) {
      toastify.error('Lỗi', 'Không thể xử lý yêu cầu');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Đang chờ
          </Badge>
        );
      case 'APPROVED':
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Icon icon="ph:storefront-bold" className="text-3xl text-gray-700" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Phê duyệt yêu cầu mở Shop
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <Input
            placeholder="Tìm theo tên shop, tên người dùng, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full h-auto justify-start bg-white border-b rounded-none p-0 mb-6 overflow-x-auto">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="hidden lg:block rounded-lg border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Người yêu cầu</TableHead>
                  <TableHead>Thông tin Shop</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon
                          icon="line-md:loading-twotone-loop"
                          className="text-3xl"
                        />
                        Đang tải danh sách yêu cầu...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-gray-500"
                    >
                      Không có yêu cầu nào trong mục này
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRequests.map((req) => (
                    <TableRow
                      key={req.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-500">
                        #{req.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={req.user.avatar || undefined} />
                            <AvatarFallback>
                              {req.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {req.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {req.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-primary">
                            {req.shopName}
                          </span>
                          <span className="text-xs text-gray-500 max-w-[200px] truncate">
                            {req.shopAddress}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {dayjs(req.createdAt).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Chi tiết
                          </Button>
                          {req.status === 'PENDING' && (
                            <>
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                                onClick={() =>
                                  onHandleRequest(req.id, 'APPROVED')
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  onHandleRequest(req.id, 'REJECTED')
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-4">
            {paginatedRequests.map((req) => (
              <Card key={req.id} className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={req.user.avatar || undefined} />
                        <AvatarFallback>
                          {req.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {req.user.name}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {req.user.email}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Thông tin Shop
                    </span>
                    <p className="text-sm font-semibold mt-1">{req.shopName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {req.shopAddress}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedRequest(req);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Chi tiết
                    </Button>
                  </div>
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        onClick={() => onHandleRequest(req.id, 'APPROVED')}
                      >
                        <Check className="mr-2 h-4 w-4" /> Duyệt
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => onHandleRequest(req.id, 'REJECTED')}
                      >
                        <X className="mr-2 h-4 w-4" /> Từ chối
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredRequests.length > 0 && (
        <div className="pt-4 flex w-full justify-center">
          <PaginationWithLinks
            page={currentPage}
            pageSize={pageSize}
            totalCount={filteredRequests.length}
          />
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="text-primary" />
              Chi tiết yêu cầu mở Shop
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
                    Thông tin người yêu cầu
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedRequest.user.avatar || undefined}
                      />
                      <AvatarFallback>
                        {selectedRequest.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-semibold">
                        {selectedRequest.user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {selectedRequest.user.email}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
                    Thông tin Shop
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Tên Shop:</span>
                      <p className="text-sm font-semibold">
                        {selectedRequest.shopName}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Địa chỉ:</span>
                      <p className="text-sm">{selectedRequest.shopAddress}</p>
                    </div>
                  </div>
                </section>
              </div>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Mô tả Shop
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg text-sm italic">
                  &quot;{selectedRequest.shopDescription || 'Không có mô tả'}&quot;
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
                  Hồ sơ định danh
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500">
                      Giấy phép kinh doanh
                    </span>
                    <div className="aspect-video bg-gray-100 rounded-lg border border-dashed flex items-center justify-center relative overflow-hidden group">
                      {selectedRequest.businessLicense ? (
                        <Image
                          width={100}
                          height={100}
                          src={selectedRequest.businessLicense}
                          alt="Business License"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-zoom-in"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <Icon icon="ph:file-x" className="text-2xl" />
                          <span className="text-[10px]">Trống</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500">
                      CCCD Mặt trước
                    </span>
                    <div className="aspect-video bg-gray-100 rounded-lg border border-dashed flex items-center justify-center relative overflow-hidden group">
                      {selectedRequest.identityCardFront ? (
                        <Image
                          width={100}
                          height={100}
                          src={selectedRequest.identityCardFront}
                          alt="ID Front"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-zoom-in"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <Icon
                            icon="ph:identification-card"
                            className="text-2xl"
                          />
                          <span className="text-[10px]">Trống</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500">CCCD Mặt sau</span>
                    <div className="aspect-video bg-gray-100 rounded-lg border border-dashed flex items-center justify-center relative overflow-hidden group">
                      {selectedRequest.identityCardBack ? (
                       <Image
                          width={100}
                          height={100}
                          src={selectedRequest.identityCardBack}
                          alt="ID Back"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-zoom-in"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <Icon
                            icon="ph:identification-card"
                            className="text-2xl"
                          />
                          <span className="text-[10px]">Trống</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {selectedRequest.status === 'PENDING' && (
                <DialogFooter className="flex gap-2 sm:gap-0">
                  <Button
                    variant="destructive"
                    className="flex-1 sm:flex-none"
                    onClick={() =>
                      onHandleRequest(selectedRequest.id, 'REJECTED')
                    }
                  >
                    Từ chối
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    onClick={() =>
                      onHandleRequest(selectedRequest.id, 'APPROVED')
                    }
                  >
                    Phê duyệt
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
