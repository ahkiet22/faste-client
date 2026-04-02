'use client';

import WidgetRenderer from '@/components/storefront-config/widget-renderer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import { MessageCircle, Search, Star } from 'lucide-react';
import Image from 'next/image';
import { AllProducts } from './partials/AllProducts';
import ShopInfo from './partials/ShopInfo';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type TProps = {
  shop: any;
};

const ShopDetails = ({ shop }: TProps) => {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'store',
      label: t('shop.tabs.store'),
      icon: 'solar:shop-2-linear',
    },
    {
      value: 'all-products',
      label: t('shop.tabs.allProducts'),
      icon: 'solar:widget-linear',
    },
    {
      value: 'collections',
      label: t('shop.tabs.collections'),
      icon: 'solar:folder-with-files-linear',
    },
    {
      value: 'today-flash-sale',
      label: t('shop.tabs.todayFlashSale'),
      icon: 'solar:bolt-circle-linear',
    },
    {
      value: 'profile',
      label: t('shop.shopProfile'),
      icon: 'solar:user-id-linear',
    },
  ];
  const [activeTab, setActiveTab] = useState('store');
  const templateWidgets =
    shop?.Template[0]?.widgets.sort(
      (a: any, b: any) => a.widgetIndex - b.widgetIndex,
    ) || [];
  // console.log('Shop in ShopDetails component:', shop, templateWidgets);

  return (
    <div className="mx-auto -mt-8 w-full max-w-7xl">
      {/* Your UI structure here */}
      {/* Shop Header */}
      <div className="overflow-hidden bg-white dark:bg-black md:rounded-b-xl shadow-lg border-x border-b border-gray-100 dark:border-gray-800">
        {/* Header Background */}
        <div
          className="px-4 md:px-8 pt-8 pb-4"
          style={{
            background: `linear-gradient(135deg, ${shop?.Template?.[0]?.theme || '#22c55e'} 0%, #1a1a1a 100%)`,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white/95 p-1 border-4 border-white/20 shadow-xl backdrop-blur-sm transition-transform hover:scale-105">
                <Image
                  src={shop.logo || '/placeholder.png'}
                  alt={shop.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md truncate">
                    {shop.name}
                  </h1>
                  <Icon
                    icon="solar:check-read-linear"
                    className="text-blue-400 w-6 h-6 shrink-0"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <Star
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      strokeWidth={0}
                    />
                    <span className="font-semibold text-white">
                      {shop.ratingStar} / 5
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5 drop-shadow-sm">
                    <Icon
                      icon={'solar:users-group-rounded-bold'}
                      width={18}
                      height={18}
                      className="text-blue-300"
                    />
                    <span className="font-medium">
                      {t('shop.followers')}: 1.5k
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <Button className="font-bold flex-1 md:flex-none px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 shadow-lg">
                <Icon
                  icon="solar:chat-round-dots-bold"
                  className="mr-2 h-5 w-5"
                />
                {t('shop.chat')}
              </Button>
              <Button className="font-bold flex-1 md:flex-none px-6 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                <Icon icon="solar:add-circle-bold" className="mr-2 h-5 w-5" />
                {t('shop.follow')}
              </Button>
            </div>
          </div>

          {/* Navigation & Search */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full justify-start bg-transparent border-0 rounded-none h-auto p-0 gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="
                      shrink-0 group relative flex items-center gap-2 px-5 py-3 rounded-t-lg transition-all duration-300
                      data-[state=active]:bg-white/10 data-[state=active]:text-white
                      data-[state=inactive]:text-white/60 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-white/5
                      cursor-pointer whitespace-nowrap border-none shadow-none
                    "
                  >
                    <Icon
                      icon={tab.icon}
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-semibold tracking-wide uppercase">
                      {tab.label}
                    </span>
                    {activeTab === tab.value && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full mx-1 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="group flex w-full md:w-72 items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 transition-all duration-300 focus-within:bg-white focus-within:w-full md:focus-within:w-96 shadow-lg">
              <Search className="h-5 w-5 text-white/70 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder={t('shop.searchProductInShop')}
                className="w-full border-none bg-transparent text-sm text-white focus:text-black outline-none placeholder:text-white/50 focus:placeholder:text-gray-400 h-6"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[700px] py-4 md:py-6 space-y-6 px-4 xl:px-0">
          {/* Render template widgets here */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              {templateWidgets.map((widget: any, index: number) => (
                <WidgetRenderer
                  key={index}
                  widget={widget}
                  shopId={shop.shopid}
                />
              ))}
              {templateWidgets.length === 0 && (
                <div className="py-20 text-center bg-white dark:bg-black rounded-lg border border-dashed border-gray-300">
                  <Icon
                    icon="mdi:store-outline"
                    className="mx-auto w-12 h-12 text-gray-300 mb-2"
                  />
                  <p className="text-gray-500">
                    Cửa hàng chưa có giao diện trang chủ
                  </p>
                </div>
              )}
            </div>
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
export default ShopDetails;
