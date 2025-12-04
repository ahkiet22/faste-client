'use client';

import WidgetRenderer from '@/components/storefront-config/widget-renderer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react/dist/iconify.js';
import { MessageCircle, Search, Star } from 'lucide-react';
import Image from 'next/image';
import { AllProducts } from './partials/AllProducts';
import ShopInfo from './partials/ShopInfo';
import { useState } from 'react';

type TProps = {
  shop: any;
};

const tabs = [
  { value: 'store', label: 'Cửa Hàng' },
  { value: 'all-products', label: 'Tất Cả Sản Phẩm' },
  { value: 'collections', label: 'Bộ Sưu Tập' },
  { value: 'flash-sale', label: 'Giá Sốc Hôm Nay' },
  { value: 'profile', label: 'Hồ Sơ Cửa Hàng' },
];

export const ShopDetails = ({ shop }: TProps) => {
  const [activeTab, setActiveTab] = useState('store');
  const templateWidgets =
    shop?.Template[0]?.widgets.sort(
      (a: any, b: any) => a.widgetIndex - b.widgetIndex,
    ) || [];
  console.log('Shop in ShopDetails component:', shop, templateWidgets);

  return (
    <div className="mx-auto -mt-8 w-full max-w-7xl">
      {/* Your UI structure here */}
      <div className="overflow-hidden">
        {/* Desktop Header */}
        <div
          className="px-8 pt-6 pb-2 bg-green-600"
          style={{
            background: `linear-gradient(to right, ${shop?.Template[0].theme}, #222})`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full overflow-hidden bg-white">
                <Image
                  src={shop.logo || '/placeholder.png'}
                  alt={shop.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <Star
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      strokeWidth={0.5}
                    />
                    {shop.ratingStar} / 5
                  </span>
                  <Icon icon={'ri:user-add-line'} width={18} height={18} />{' '}
                  <span>Theo dõi: 1</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <span className="mr-2">+</span>
                Theo dõi
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start bg-transparent border-0 rounded-none h-auto p-0 gap-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none p-0! max-w-[160px] border-0 border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-white data-[state=active]:shadow-none data-[state=active]:font-bold text-white hover:font-bold px-4 py-3 font-medium text-sm cursor-pointer"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm sản phẩm tại cửa hàng"
                className="w-64 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] py-6 space-y-4 bg-none">
          {/* Render template widgets here */}
          {activeTab === 'store' && (
            <>
              {templateWidgets.map((widget: any, index: number) => (
                <WidgetRenderer
                  key={index}
                  widget={widget}
                  shopId={shop.shopid}
                />
              ))}
            </>
          )}
          {activeTab === 'profile' && (
            // <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
            //   <div className="flex items-center justify-between">
            //     <div>
            //       <h2 className="text-2xl font-semibold">{shop.name}</h2>
            //       <p className="text-sm text-muted-foreground">
            //         {shop.businessType}
            //       </p>
            //     </div>
            //     <div className="flex items-center gap-2 text-yellow-500">
            //       <Icon icon="mdi:star" className="w-5 h-5" />
            //       <span className="font-medium">
            //         {shop.ratingStar ?? 'N/A'}
            //       </span>
            //     </div>
            //   </div>

            //   <div>
            //     <h3 className="text-sm font-medium text-muted-foreground mb-1">
            //       Mô tả cửa hàng
            //     </h3>
            //     <p className="text-sm leading-relaxed">
            //       {shop.description || 'Chưa có mô tả'}
            //     </p>
            //   </div>

            //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            //     <div className="flex items-center gap-2">
            //       <Icon
            //         icon="mdi:calendar-clock"
            //         className="w-4 h-4 text-muted-foreground"
            //       />
            //       <span>
            //         Ngày tạo:{' '}
            //         <span className="font-medium text-foreground">
            //           {shop.createdAt
            //             ? dayjs(shop.createdAt).format('DD/MM/YYYY')
            //             : '—'}
            //         </span>
            //       </span>
            //     </div>

            //     <div className="flex items-center gap-2">
            //       <Icon
            //         icon="mdi:message-reply"
            //         className="w-4 h-4 text-muted-foreground"
            //       />
            //       <span>
            //         Tỷ lệ phản hồi:{' '}
            //         <span className="font-medium text-foreground">
            //           {shop.responseRate ? `${shop.responseRate}%` : '—'}
            //         </span>
            //       </span>
            //     </div>

            //     <div className="flex items-center gap-2">
            //       <Icon
            //         icon="mdi:clock-fast"
            //         className="w-4 h-4 text-muted-foreground"
            //       />
            //       <span>
            //         Thời gian phản hồi:{' '}
            //         <span className="font-medium text-foreground">
            //           {shop.responseTime || '—'}
            //         </span>
            //       </span>
            //     </div>
            //   </div>
            // </div>
            <ShopInfo shop={shop} />
          )}

          {activeTab === 'all-products' && <AllProducts shopId={shop.shopid} />}
        </div>
      </div>
    </div>
  );
};
