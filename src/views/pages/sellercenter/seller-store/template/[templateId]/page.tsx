'use client';

import { AddWidgets } from '@/components/storefront-config/add-widgets';
import DesktopPreview from '@/components/storefront-config/desktop-preview';
import MobilePreview from '@/components/storefront-config/mobile-preview';
import WidgetPanel from '@/components/storefront-config/widget-panel';
import { toastify } from '@/components/ToastNotification';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { getDetailShopById } from '@/services/shop';
import { getAllWidgets } from '@/services/widget';
import { StoreConfig, Widget, WidgetType } from '@/types/widget';
import { useEffect, useState } from 'react';

interface TProps {
  templateId: number;
}

export const TemplateWidgetDetailPage = (props: TProps) => {
  const { templateId } = props;
  const [config, setConfig] = useState<StoreConfig>({
    storeName: 'null',
    storeAvatar: 'null',
    followers: 0,
    widgets: [],
  });
  const [activeTab, setActiveTab] = useState('computer');
  const { user } = useAuth();

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

  const fetchDataTemplateWidget = async (
    templateId: number,
    userId: number,
  ) => {
    const resShop = await getDetailShopById(userId);
    const resWidget = await getAllWidgets(templateId);
    console.log(resShop);
    console.log("resWidget", resWidget);
    if (resShop.status === 'success' && resWidget.status === 'success') {
      setConfig({
        followers: resShop.data.followerCount ? resShop.data.followerCount : 0,
        storeAvatar: resShop.data.logo,
        storeName: resShop.data.name,
        widgets: resWidget.data,
      });
    } else {
      toastify.error('Lỗi khi lấy dữ liệu');
    }
  };

  useEffect(() => {
    if (templateId && user?.id) {
      fetchDataTemplateWidget(templateId, user?.id);
    }
  }, [templateId, user?.id]);

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
          {activeTab === 'phone' && (
            <MobilePreview
              config={config}
              onReorderWidgets={handleReorderWidgets}
            />
          )}
          {activeTab === 'computer' && (
            <DesktopPreview
              config={config}
              onReorderWidgets={handleReorderWidgets}
            />
          )}
        </div>

        {/* Right: Widget Panel */}
        <div className="w-[450px] border-l bg-card">
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
};
