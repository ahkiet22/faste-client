'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenuCheckboxes } from './MultiSelectProducts';
import { getAllProductPublicBySeller } from '@/services/product';
import { useEffect, useState } from 'react';
import { toastify } from '@/components/ToastNotification';
import { TableData } from './TableData';
import { PaginationWithLinks } from '@/components/pagination-table';



const tabs = [
  { name: 'Tất cả', value: 'all' },
  { name: 'Đang bán', value: 'selling' },
  { name: 'Bản nháp', value: 'draft' },
  { name: 'Hết hàng', value: 'soldout' },
  { name: 'Chờ duyệt', value: 'pending' },
  { name: 'Vi phạm', value: 'violation' },
  { name: 'Đã xóa', value: 'deleted' },
];

interface IResProduct {
  data: any[];
  totalItem: number;
  page: number;
  limit: number;
  totalPage: number;
}

export default function Page() {
  const [products, setProducts] = useState<IResProduct | null>(null);

  const fetchDataProduct = async () => {
    try {
      const res = await getAllProductPublicBySeller();
      if (res.statusCode === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      toastify.success('Product', 'Error server');
    }
  };

  useEffect(() => {
    fetchDataProduct();
  }, []);

  const tabContentMap: Record<string, React.ReactNode> = {
    all: products ? (
      <TableData
        data={products.data || []}
        limit={products.limit}
        page={products.page}
        totalItem={products.totalItem}
        totalPage={products.totalPage}
      />
    ) : (
      <div>Đang tải dữ liệu...</div>
    ),
    selling: <div>Giao diện cho Đang bán</div>,
    draft: <div>Giao diện cho Bản nháp</div>,
    soldout: <div>Giao diện cho Hết hàng</div>,
    pending: <div>Giao diện cho Chờ duyệt</div>,
    violation: <div>Giao diện cho Vi phạm</div>,
    deleted: <div>Giao diện cho Đã xóa</div>,
  };

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full h-full">
      <TabsList className="w-full flex-wrap h-auto justify-start gap-2 bg-white py-2 ">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="bg-white px-2 py-4 rounded-xl flex items-center justify-between gap-x-2">
        <div className="flex items-center w-[70%]">
          <Select defaultValue="name">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Tên sản phẩm</SelectItem>
                <SelectItem value="code">Mã sản phẩm</SelectItem>
                <SelectItem value="sku">Mã SKU</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="Vui lòng nhập" />
        </div>
        <div>
          <DropdownMenuCheckboxes />
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Tên sản phẩm</SelectItem>
                <SelectItem value="code">Mã sản phẩm</SelectItem>
                <SelectItem value="sku">Mã SKU</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl mb-4">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="p-3 border rounded-md">
              {tabContentMap[tab.value]}
            </div>
          </TabsContent>
        ))}
      </div>
      <PaginationWithLinks page={1} pageSize={10} totalCount={5} />
    </Tabs>
  );
}
