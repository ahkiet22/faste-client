'use client';

import { Search, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WidgetRenderer from '@/components/storefront-config/widget-renderer';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StoreConfig } from '@/types/widget';
import { Icon } from '@iconify/react/dist/iconify.js';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks';

interface DesktopPreviewProps {
  config: StoreConfig;
  onReorderWidgets?: (widgets: any[]) => void;
}

export default function DesktopPreview({
  config,
  onReorderWidgets,
}: DesktopPreviewProps) {
  const basePath = '/sellercenter/seller-store/template';
  const [maxWidthClass, setMaxWidthClass] = useState('max-w-[1400px]');
  const pathname = usePathname();
  const enabledWidgets = config.widgets
    .filter((w) => w.isVisible)
    .sort((a, b) => a.widgetIndex - b.widgetIndex);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {t} = useTranslation()

  const breakpoint = useBreakpoint();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorderWidgets) {
      const oldIndex = config.widgets.findIndex((w) => w.id === active.id);
      const newIndex = config.widgets.findIndex((w) => w.id === over.id);

      const reorderedWidgets = arrayMove(
        config.widgets,
        oldIndex,
        newIndex,
      ).map((widget, index) => ({
        ...widget,
        widgetIndex: index,
      }));

      onReorderWidgets(reorderedWidgets);
    }
  };
  useEffect(() => {
    const isPathName =
      pathname === basePath || pathname.startsWith(basePath + '/');

    let newMaxWidthClass = 'max-w-[1400px]'; // default

    if (isPathName) {
      if (breakpoint === 'xl' || breakpoint === 'lg')
        newMaxWidthClass = 'max-w-2xl';
      else if (breakpoint === '2xl') newMaxWidthClass = 'max-w-5xl';
    }

    if (newMaxWidthClass !== maxWidthClass) {
      setMaxWidthClass(newMaxWidthClass);
    }
  }, [pathname, breakpoint, maxWidthClass]);

  return (
    <div className={`mx-auto w-full ${maxWidthClass}`}>
      {/* Desktop Browser Frame */}
      <div className="overflow-hidden rounded-lg border-2 border-gray-300 bg-white shadow-2xl">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 border-b bg-gray-100 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 rounded bg-white px-3 py-1 text-xs text-gray-500">
            https://faste.com/shop/{config.storeName.toLowerCase()}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <span className="text-3xl">🏪</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {config.storeName}
                </h1>
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    0.0 / 5
                  </span>
                  <Icon icon={'ri:user-add-line'} width={18} height={18} />{' '}
                  <span>Theo dõi: {config.followers}</span>
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
                {t('shop.follow')}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button className="border-b-2 border-white pb-2 text-sm font-medium text-white">
                Cửa Hàng
              </button>
              <button className="pb-2 text-sm font-medium text-white/70 hover:text-white">
                Tất Cả Sản Phẩm
              </button>
              <button className="pb-2 text-sm font-medium text-white/70 hover:text-white">
                Bộ Sưu Tập
              </button>
              <button className="pb-2 text-sm font-medium text-white/70 hover:text-white">
                Giá Sốc Hôm Nay
              </button>
              <button className="pb-2 text-sm font-medium text-white/70 hover:text-white">
                {t('shop.shopProfile')}
              </button>
            </div>
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
        <div className="min-h-[600px] bg-gray-50 p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={enabledWidgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {enabledWidgets.map((widget) => (
                  <SortableWidgetPreview key={widget.id} widget={widget} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

function SortableWidgetPreview({ widget }: { widget: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <WidgetRenderer widget={widget} />
    </div>
  );
}
