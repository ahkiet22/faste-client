'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoucherCard } from './partials/voucher-card';

const categories = [
  'Tất cả',
  'Shopee',
  'ShopeeVIP',
  'Shop',
  'Nạp điện thoại & Dịch vụ',
  'Scan & Pay',
  'More',
];

const vouchers = [
  {
    id: '1',
    type: 'discount' as const,
    discount: 'Giảm tối đa 40kđ',
    minOrder: 'Đơn tối thiểu 100kđ',
    tag: 'Freeship Lâm Đẹp',
    tagColor: 'red' as const,
    conditions: 'Tất cả hình thức thanh toán',
    validity: '1 ngày',
  },
  {
    id: '2',
    type: 'discount' as const,
    discount: 'Giảm tối đa 35kđ',
    minOrder: 'Đơn tối thiểu 04',
    tag: 'Freeship Lâm Đẹp',
    tagColor: 'red' as const,
    conditions: 'Tất cả hình thức thanh toán',
    validity: '1 ngày',
  },
  {
    id: '3',
    type: 'freeship' as const,
    discount: 'Giảm tối đa 99kđ',
    minOrder: 'Đơn tối thiểu 100kđ',
    conditions: 'Toàn Ngành Hàng',
    validity: '1 ngày',
  },
  {
    id: '4',
    type: 'freeship' as const,
    discount: 'Giảm tối đa 299kđ',
    minOrder: 'Đơn tối thiểu 500kđ',
    conditions: 'Toàn Ngành Hàng',
    validity: '1 ngày',
  },
  {
    id: '5',
    type: 'video' as const,
    discount: 'Giảm 15% Giảm tối đa 500kđ',
    minOrder: 'Đơn tối thiểu 29kđ',
    tag: 'Chỉ có trên Video',
    tagColor: 'red' as const,
    conditions: 'Tất cả hình thức thanh toán',
    validity: '1 ngày',
  },
  {
    id: '6',
    type: 'live' as const,
    discount: 'Giảm 15% Giảm tối đa 500kđ',
    minOrder: 'Đơn tối thiểu 29kđ',
    tag: 'Chỉ có trên Live',
    tagColor: 'red' as const,
    conditions: 'Tất cả hình thức thanh toán',
    validity: '1 ngày',
  },
  {
    id: '7',
    type: 'live' as const,
    discount: 'Giảm tối đa 1trđ',
    minOrder: 'Đơn tối thiểu 1trđ',
    tag: 'Chỉ có trên Live',
    tagColor: 'red' as const,
    conditions: 'Tất cả hình thức thanh toán',
    validity: '1 ngày',
  },
  {
    id: '8',
    type: 'discount' as const,
    discount: 'Giảm tối đa 100kđ',
    minOrder: 'Đơn tối thiểu 300kđ',
    tag: 'Chỉ có trên Live',
    tagColor: 'red' as const,
    conditions: 'Shopee Live x Bách Hóa',
    validity: '1 ngày',
  },
];

export function VoucherWalletPage() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [voucherCode, setVoucherCode] = useState('');

  return (
    <div className="bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kho Voucher
            </h1>
            <div className="flex gap-4 text-sm">
              <a
                href="#"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Tìm thêm voucher
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href="#"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Xem lịch sử voucher
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href="#"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Tìm hiểu
              </a>
            </div>
          </div>

          {/* Voucher Input */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã Voucher
              </label>
              <Input
                placeholder="Nhập mã voucher tại đây"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="bg-white dark:bg-slate-800"
              />
            </div>
            <Button className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-700">
              Lưu
            </Button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`py-4 px-1 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === category
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voucher Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.id} {...voucher} />
          ))}
        </div>
      </div>
    </div>
  );
}
