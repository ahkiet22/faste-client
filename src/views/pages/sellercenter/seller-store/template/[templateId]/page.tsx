'use client';

import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { AddWidgets } from '@/components/storefront-config/add-widgets';
import DesktopPreview from '@/components/storefront-config/desktop-preview';
import MobilePreview from '@/components/storefront-config/mobile-preview';
import WidgetPanel from '@/components/storefront-config/widget-panel';
import { toastify } from '@/components/ToastNotification';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { getDetailShopById } from '@/services/shop';
import {
  AddWidget,
  deleteWidget,
  getAllWidgets,
  updateManyWidgets,
} from '@/services/widget';
import { StoreConfig, Widget, WidgetType } from '@/types/widget';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AlertConfirm = dynamic(() => import('@/components/AlertConfirm'), {
  loading: () => <LoadingDialog isLoading />,
  ssr: false,
});

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
  const [activeTab, setActiveTab] = useState<string>('computer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    itemId: string | null;
    open: boolean;
  }>({
    itemId: null,
    open: false,
  });

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
    setConfirmDialog({ itemId: widgetId, open: true });
  };

  const handleCloseAlertConfirm = () => {
    setConfirmDialog({ itemId: null, open: false });
  };

  const handleConfirmDeleteWidget = async () => {
    setIsLoading(true);
    if (!confirmDialog.itemId) {
      toastify.error('', 'Có lỗi xảy ra vui lòng thử lại!');
    } else {
      try {
        console.log(confirmDialog);
        const res = await deleteWidget(Number(confirmDialog.itemId));
        if (res.status === 'success') {
          toastify.success('', res.message);
          setConfig((prev) => ({
            ...prev,
            widgets: prev.widgets.filter((w) => w.id !== confirmDialog.itemId),
          }));
        } else {
          toastify.error('', res.message);
        }
      } catch (error) {
        toastify.error('', 'Có lỗi xảy ra vui lòng thử lại!');
      }
    }
    setIsLoading(false);
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

  const handleAddWidgetTemplete = async (data: Omit<Widget, 'widgetIndex'>) => {
    if (config.widgets.length > 10) {
      toastify.error(
        '',
        'Đã có 10 widget được hiện (không tính tiêu đề), hãy ẩn bớt để thêm widget.',
      );
      return;
    }
    setIsLoading(true);
    try {
      const res = await AddWidget({
        templateId,
        refViewId: templateId,
        isVisible: true,
        widgetIndex: config.widgets.length,
        name: data.label,
        type: data.type,
        viewConfig: data.viewConfig,
      });
      if (res.status === 'success') {
        const newWidget: Widget = {
          id: res.data.id,
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
        toastify.success('', res.message);
        return;
      }
      toastify.error('', res.message);
    } catch (error) {
      toastify.error('', 'Đã có lỗi xảy ra vui long thử lại sau vài giây');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const newWidgetFillter = config.widgets.map((item) => ({
        id: Number(item.id),
        name: item.label,
        type: item.type,
        widgetIndex: item.widgetIndex,
        isVisible: item.isVisible,
        viewConfig: item.viewConfig ? item.viewConfig : null,
      }));
      console.log('APply config', config);
      const res = await updateManyWidgets(templateId, {
        widgets: newWidgetFillter,
      });
      if (res.status === 'error') {
        toastify.error('', res.message);
        return;
      }
      toastify.success('', res.message);
    } catch (err) {
      toastify.error('', 'Có lỗi xảy ra vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataTemplateWidget = async (
    templateId: number,
    userId: number,
  ) => {
    const resShop = await getDetailShopById(userId);
    const resWidget = await getAllWidgets(templateId);
    console.log(resShop);
    console.log('resWidget', resWidget);
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
      <AlertConfirm
        onClose={handleCloseAlertConfirm}
        type="warning"
        onConfirm={handleConfirmDeleteWidget}
        open={confirmDialog.open}
        title="Thông báo"
        description="Bạn có chắc chắn muốn thực hiện?"
      />

      <LoadingDialog isLoading={isLoading} />

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
