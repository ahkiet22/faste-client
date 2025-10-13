'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';
import { DropdownMenuCheckboxes } from './MultiSelectProducts';
import { getAllProductPublicBySeller } from '@/services/product';
import { useEffect, useState } from 'react';
import { ToastNotifications } from '@/components/ToastNotification';
import { TableData } from './TableData';

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
      ToastNotifications.success('Product', 'Error server');
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
    <Tabs defaultValue={tabs[0].value} className="w-full p-2 h-full">
      <TabsList className="w-full p-0 bg-background justify-start border-b rounded-xl overflow-hidden">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-blue-600 data-[state=active]:border-b-2 data-[state=active]:text-blue-500 -mb-[2px] rounded-t"
          >
            <span className="text-lg font-normal">{tab.name}</span>
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

      <div className="bg-white px-2 py-4 rounded-xl">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="p-3 border rounded-md">
              {tabContentMap[tab.value]}
              <div className="mt-2 flex justify-end">
                <Button size="icon" variant="secondary" className="h-7 w-7">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
