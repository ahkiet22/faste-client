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
import { getAdminCategories, deleteCategory } from '@/services/admin-category';
import { TAdminCategory } from '@/types/admin/category';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Plus, Layers } from 'lucide-react';
import Image from 'next/image';
import { CategoryModal } from './category-modal';
import AlertConfirm from '@/components/AlertConfirm';

export default function CategoryListPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categoriesData, setCategoriesData] = useState<TAdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TAdminCategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const pageSize = 10;

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCategories();
      if (res.status === 'error') {
        toastify.error('Lỗi', res.message || 'Không thể lấy dữ liệu danh mục');
      } else {
        const data = res.data?.data || res.data || [];
        setCategoriesData(data);
      }
    } catch (error) {
      console.error(error);
      toastify.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    let filtered = [...categoriesData];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.id.toString().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, categoriesData]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, currentPage]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: TAdminCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete);
        toastify.success('Thành công', 'Xóa danh mục thành công');
        fetchCategories();
      } catch (error: any) {
        toastify.error('Lỗi', error.message || 'Không thể xóa danh mục');
      } finally {
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const getParentName = (parentId: number | null) => {
    if (!parentId) return null;
    const parent = categoriesData.find(c => c.id === parentId);
    return parent ? parent.name : null;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon icon="ph:list-bullets" className="text-3xl text-gray-700" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Quản lý danh mục
          </h1>
        </div>
        <Button onClick={handleAddCategory} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <Input
            placeholder="Tìm theo tên danh mục, mô tả, ID..."
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
              <TableHead>Danh mục</TableHead>
              <TableHead>Danh mục cha</TableHead>
              <TableHead className="max-w-[250px]">Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  Đang tải danh sách danh mục...
                </TableCell>
              </TableRow>
            ) : paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  Không tìm thấy danh mục nào
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-500 text-xs">#{category.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border overflow-hidden flex-shrink-0 bg-gray-50">
                        <Image 
                          src={category.image || '/placeholder-category.png'} 
                          fill 
                          alt={category.name} 
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="font-semibold text-sm">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.parentCategoryId ? (
                      <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        <Layers className="w-3 h-3" />
                        {getParentName(category.parentCategoryId) || `ID: ${category.parentCategoryId}`}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Danh mục gốc</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 max-w-[250px] truncate">
                    {category.description || 'Chưa có mô tả'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {category.createdAt ? dayjs(category.createdAt).format('DD/MM/YYYY') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditCategory(category)}>
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(category.id)}>
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

      {filteredCategories.length > 0 && (
        <div className="pt-4 flex w-full justify-center">
            <PaginationWithLinks
              page={currentPage}
              pageSize={pageSize}
              totalCount={filteredCategories.length}
              pageSizeSelectOptions={{
                  pageSizeOptions: [10, 20, 50],
                  pageSizeSearchParam: 'limit'
              }}
            />
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCategories} 
        category={selectedCategory}
      />

      <AlertConfirm
        open={deleteConfirmOpen}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
        type="error"
        onConfirm={confirmDelete}
        onClose={() => setDeleteConfirmOpen(false)}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
