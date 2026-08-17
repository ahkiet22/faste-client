'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { Icon } from '@iconify/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTE_CONFIG } from '@/configs/router';

interface TProps {
  data: any[];
  totalItem: number;
  page: number;
  limit: number;
  totalPage: number;
  onDelete?: (id: string) => void;
}

export function TableData(props: TProps) {
  const { data = [], onDelete } = props;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Xử lý chọn tất cả
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Xử lý chọn từng dòng
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="w-full border rounded-xl overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-16">Hình ảnh</TableHead>
            <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>
            <TableHead>Giá bán</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Số SKU</TableHead>
            <TableHead>Ngày xuất bản</TableHead>
            <TableHead className="text-right w-16">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Icon icon="lucide:box-select" className="w-8 h-8 text-gray-400" />
                  <span>Không tìm thấy sản phẩm nào</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const mainImage = item.images?.[0] || '/placeholder.svg';
              const minPrice = item.skus?.[0]?.price ?? item.basePrice ?? 0;
              const isSelected = selectedIds.includes(item.id);

              return (
                <TableRow
                  key={item.id}
                  className={clsx(
                    'transition-colors hover:bg-gray-50/60',
                    isSelected && 'bg-blue-50/40 hover:bg-blue-50/60',
                  )}
                >
                  {/* Checkbox */}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
                      aria-label={`Select ${item.name}`}
                    />
                  </TableCell>

                  {/* Ảnh sản phẩm */}
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg border bg-gray-50 overflow-hidden shrink-0">
                      <Image
                        src={mainImage}
                        alt={item.name || 'Product'}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </TableCell>

                  {/* Tên sản phẩm & Slug */}
                  <TableCell>
                    <div className="flex flex-col max-w-[280px]">
                      <Link
                        href={`${ROUTE_CONFIG.SELLER.PRODUCT.INDEX}/${item.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                      {item.slugId && (
                        <span className="text-xs text-muted-foreground font-mono truncate">
                          {item.slugId}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Giá bán */}
                  <TableCell className="font-semibold text-gray-900">
                    {Number(minPrice).toLocaleString('vi-VN')} đ
                  </TableCell>

                  {/* Trạng thái (Badge) */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={clsx(
                        'px-2.5 py-0.5 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5',
                        {
                          'bg-gray-50 border-gray-300 text-gray-600':
                            item.status === 'DRAFT',

                          'bg-emerald-50 border-emerald-300 text-emerald-700':
                            item.status === 'PUBLISHED',

                          'bg-amber-50 border-amber-300 text-amber-700':
                            item.status === 'ARCHIVED',
                        },
                      )}
                    >
                      <span
                        className={clsx('w-1.5 h-1.5 rounded-full', {
                          'bg-gray-500': item.status === 'DRAFT',
                          'bg-emerald-500': item.status === 'PUBLISHED',
                          'bg-amber-500': item.status === 'ARCHIVED',
                        })}
                      />
                      {item.status === 'PUBLISHED'
                        ? 'Đã xuất bản'
                        : item.status === 'DRAFT'
                        ? 'Bản nháp'
                        : 'Lưu trữ'}
                    </Badge>
                  </TableCell>

                  {/* Số lượng SKU */}
                  <TableCell className="text-center font-medium">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {item.skus?.length || 0} SKU
                    </span>
                  </TableCell>

                  {/* Ngày đăng */}
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.publishedAt
                      ? dayjs(item.publishedAt).format('DD/MM/YYYY - HH:mm')
                      : 'Chưa xuất bản'}
                  </TableCell>

                  {/* Action Menu */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <Icon icon="lucide:more-vertical" className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`${ROUTE_CONFIG.SELLER.PRODUCT.INDEX}/${item.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon icon="lucide:eye" className="w-4 h-4 text-gray-500" />
                            <span>Xem chi tiết</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`${ROUTE_CONFIG.SELLER.PRODUCT.EDIT}/${item.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon icon="lucide:square-pen" className="w-4 h-4 text-blue-500" />
                            <span>Chỉnh sửa</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => onDelete?.(item.id)}
                        >
                          <Icon icon="lucide:trash-2" className="w-4 h-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}