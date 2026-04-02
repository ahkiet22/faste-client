'use client';

import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@iconify/react';
import { toastify } from '@/components/ToastNotification';
import { PaginationWithLinks } from '@/components/pagination-table';
import { getAdminBrands, deleteBrand } from '@/services/admin-brand';
import { TAdminBrand } from '@/types/admin/brand';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { BrandModal } from './brand-modal';
import AlertConfirm from '@/components/AlertConfirm';

export default function BrandListPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [brandsData, setBrandsData] = useState<TAdminBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<TAdminBrand | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);

  const pageSize = 10;

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminBrands();
      if (res.status === 'error') {
        toastify.error('Lỗi', res.message || 'Không thể lấy dữ liệu thương hiệu');
      } else {
        const data = res.data?.data || res.data || [];
        setBrandsData(data);
      }
    } catch (error) {
      console.error(error);
      toastify.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách thương hiệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    let filtered = [...brandsData];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.id.toString().includes(query) ||
          b.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, brandsData]);

  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBrands.slice(startIndex, startIndex + pageSize);
  }, [filteredBrands, currentPage]);

  const handleAddBrand = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: TAdminBrand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setBrandToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (brandToDelete) {
      try {
        await deleteBrand(brandToDelete);
        toastify.success('Thành công', 'Xóa thương hiệu thành công');
        fetchBrands();
      } catch (error: any) {
        toastify.error('Lỗi', error.message || 'Không thể xóa thương hiệu');
      } finally {
        setDeleteConfirmOpen(false);
        setBrandToDelete(null);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon icon="ph:trademark" className="text-3xl text-gray-700" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Quản lý thương hiệu
          </h1>
        </div>
        <Button onClick={handleAddBrand} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Thêm thương hiệu
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <Input
            placeholder="Tìm theo tên thương hiệu, mô tả, ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Thương hiệu</TableHead>
              <TableHead className="max-w-[300px]">Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  Đang tải danh sách thương hiệu...
                </TableCell>
              </TableRow>
            ) : paginatedBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  Không tìm thấy thương hiệu nào
                </TableCell>
              </TableRow>
            ) : (
              paginatedBrands.map((brand) => (
                <TableRow key={brand.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-500 text-xs">#{brand.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border overflow-hidden flex-shrink-0 bg-gray-50">
                        <Image 
                          src={brand.logo || '/placeholder-brand.png'} 
                          fill 
                          alt={brand.name} 
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="font-semibold text-sm">{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-[300px] truncate">
                    {brand.description || 'Chưa có mô tả'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {brand.createdAt ? dayjs(brand.createdAt).format('DD/MM/YYYY') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditBrand(brand)}>
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(brand.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredBrands.length > 0 && (
        <div className="pt-4 flex w-full justify-center">
            <PaginationWithLinks
              page={currentPage}
              pageSize={pageSize}
              totalCount={filteredBrands.length}
              pageSizeSelectOptions={{
                  pageSizeOptions: [10, 20, 50],
                  pageSizeSearchParam: 'limit'
              }}
            />
        </div>
      )}

      <BrandModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchBrands} 
        brand={selectedBrand}
      />

      <AlertConfirm
        open={deleteConfirmOpen}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa thương hiệu này? Hành động này không thể hoàn tác."
        type="error"
        onConfirm={confirmDelete}
        onClose={() => setDeleteConfirmOpen(false)}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
