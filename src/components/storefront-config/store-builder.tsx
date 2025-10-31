'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MobilePreview from '@/components/storefront-config/mobile-preview';
import DesktopPreview from '@/components/storefront-config/desktop-preview';
import WidgetPanel from '@/components/storefront-config/widget-panel';
import { StoreConfig, Widget, WidgetType } from '@/types/widget';
import { AddWidgets } from './add-widgets';
import { toastify } from '../ToastNotification';

const initialWidgets: Widget[] = [
  {
    id: '1',
    type: WidgetType.TITLE,
    label: 'Tiêu đề',
    icon: 'material-symbols:title',
    isVisible: true,
    widgetIndex: 0,
  },
  {
    id: '2',
    type: WidgetType.DISCOUNT,
    label: 'Mã giảm giá',
    icon: 'streamline:discount-percent-coupon',
    isVisible: true,
    widgetIndex: 1,
  },
  {
    id: '3',
    type: WidgetType.BANNER_CAROUSEL,
    label: 'Banner',
    icon: 'ph:slideshow',
    isVisible: true,
    widgetIndex: 2,
  },
  {
    id: '4',
    type: WidgetType.CATEGORIES_CAROUSEL,
    label: 'Danh mục',
    icon: 'material-symbols:category',
    isVisible: true,
    widgetIndex: 3,
  },
  {
    id: '5',
    type: WidgetType.PRODUCTS_ALL,
    label: 'Widget sản phẩm',
    icon: 'streamline-cyber:shopping-product',
    isVisible: true,
    widgetIndex: 4,
  },
  {
    id: '6',
    type: WidgetType.STORIES_CAROUSEL,
    label: 'Bảng tin',
    icon: 'streamline-sharp:story-post',
    isVisible: true,
    widgetIndex: 5,
  },
  {
    id: '7',
    type: WidgetType.FLASH_SALE,
    label: 'Flash Sale',
    icon: 'typcn:flash-outline',
    isVisible: false,
    widgetIndex: 6,
  },
  {
    id: '8',
    type: WidgetType.COLLECTIONS_VERTICAL,
    label: 'Bộ sưu tập',
    icon: 'material-symbols:collections-bookmark',
    isVisible: false,
    widgetIndex: 7,
  },
];

const initialConfig: StoreConfig = {
  storeName: 'FastE',
  storeAvatar: '/generic-store-logo.png',
  followers: 0,
  widgets: initialWidgets,
};

export default function StoreBuilder() {
  const [config, setConfig] = useState<StoreConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState('phone');

  const handleToggleWidget = (widgetId: string) => {
    setConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w,
      ),
    }));
  };

  const handleReorderWidgets = (widgets: Widget[]) => {
    setConfig((prev) => ({
      ...prev,
      widgets,
    }));
  };

  const handleDeleteWidget = (widgetId: string) => {
    setConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== widgetId),
    }));
  };

  const handleAddWidget = () => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: WidgetType.PRODUCTS_ALL,
      label: 'Widget sản phẩm',
      icon: 'streamline-cyber:shopping-product',
      isVisible: true,
      widgetIndex: config.widgets.length,
    };
    setConfig((prev) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const handleAddWidgetTemplete = (data: Omit<Widget, 'widgetIndex'>) => {
    if (config.widgets.length > 10) {
      toastify.error(
        '',
        'Đã có 10 widget được hiện (không tính tiêu đề), hãy ẩn bớt để thêm widget.',
      );
      return;
    }
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: data.type,
      label: data.label,
      icon: data.icon,
      isVisible: true,
      widgetIndex: config.widgets.length,
    };
    setConfig((prev) => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
  };

  const handleApply = async () => {
    try {
      console.log(config);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="phone">Điện thoại</TabsTrigger>
                <TabsTrigger value="computer">Máy tính</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-x-4">
            <AddWidgets onAddWidget={handleAddWidgetTemplete} />
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left: Preview */}
        <div className="flex-1 overflow-auto bg-muted/30 p-8">
          {activeTab === 'phone' ? (
            <MobilePreview
              config={config}
              onReorderWidgets={handleReorderWidgets}
            />
          ) : (
            <DesktopPreview
              config={config}
              onReorderWidgets={handleReorderWidgets}
            />
          )}
        </div>

        {/* Right: Widget Panel */}
        <div className="w-[500px] border-l bg-card">
          <WidgetPanel
            widgets={config.widgets}
            onToggleWidget={handleToggleWidget}
            onReorderWidgets={handleReorderWidgets}
            onDeleteWidget={handleDeleteWidget}
            onAddWidget={handleAddWidget}
          />
        </div>
      </div>
    </div>
  );
}
