'use client';

import {
  ShoppingCart,
  Search,
  MoreVertical,
  ChevronLeft,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface MobilePreviewProps {
  config: StoreConfig;
  onReorderWidgets?: (widgets: any[]) => void;
}

export default function MobilePreview({
  config,
  onReorderWidgets,
}: MobilePreviewProps) {
  const enabledWidgets = config.widgets
    .filter((w) => w.isVisible)
    .sort((a, b) => a.widgetIndex - b.widgetIndex);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {t} = useTranslation();

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

  return (
    <div className="mx-auto flex justify-center">
      {/* Phone Frame */}
      <div className="relative h-[720px] w-[355px] overflow-hidden rounded-[3rem] border-[14px] border-gray-900 bg-white shadow-2xl">
        {/* Status Bar */}
        <div className="absolute left-0 right-0 top-0 z-50 flex h-11 items-center justify-between bg-gradient-to-br from-teal-700 to-teal-900 px-6 text-white">
          <span className="text-sm font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <Icon icon={'mdi:signal'} />
            <Icon icon={'material-symbols:5g'} />
            <Icon icon={'gg:battery'} />
          </div>
        </div>

        {/* App Header */}
        <div className="absolute left-0 right-0 top-11 z-40 bg-gradient-to-br from-teal-700 to-teal-900 pb-4 pt-3">
          <div className="flex items-center justify-between px-4">
            <ChevronLeft className="h-6 w-6 text-white" />
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/20 px-3 py-2 mx-3">
              <Search className="h-4 w-4 text-white/80" />
              <span className="text-sm text-white/80">
                Tìm kiếm tại cửa hàng
              </span>
            </div>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-white" />
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-red-500 p-0 text-xs flex items-center justify-center border-2 border-white">
                1
              </Badge>
            </div>
            <MoreVertical className="h-6 w-6 text-white ml-3" />
          </div>
        </div>

        {/* Store Info */}
        <div className="absolute left-0 right-0 top-[108px] z-30 bg-gradient-to-br from-teal-700 to-teal-900 py-4">
          <div className="flex items-center gap-3 px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {config.storeName}
                </h2>
                {/* <Badge
                  variant="secondary"
                  className="h-5 bg-white/20 text-white text-xs border-0"
                >
                  ✓
                </Badge> */}
              </div>
              <div className="flex items-center gap-1 text-sm text-white/90">
                <Icon icon={'ri:user-add-line'} width={18} height={18} />
                <span>{config.followers}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="h-8 bg-blue-500 hover:bg-blue-600 text-white text-xs px-4"
              >
                Chat
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs px-3"
              >
                {t('shop.follow')}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="absolute left-0 right-0 top-[215px] z-20 border-b bg-white">
          <div className="flex items-center justify-around px-4 py-3">
            <button className="flex flex-col items-center gap-1 text-blue-500">
              <span className="text-xs font-medium">Cửa Hàng</span>
              <div className="h-0.5 w-12 rounded-full bg-blue-500" />
            </button>
            <button className="text-xs font-medium text-gray-600">
              Sản Phẩm
            </button>
            <button className="text-xs font-medium text-gray-600">
              Bộ Sưu Tập
            </button>
            <button className="text-xs font-medium text-gray-600">
              Giá Sốc
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="absolute left-0 right-0 top-[248px] bottom-0 overflow-y-auto hide-scrollbar bg-gray-50">
          <div className="space-y-3 p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={enabledWidgets.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
              >
                {enabledWidgets.map((widget) => (
                  <SortableWidgetPreview key={widget.id} widget={widget} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Chat Button */}
        <div className="absolute bottom-4 right-3 z-50">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-lg hover:bg-blue-600">
            <MessageCircle className="h-6 w-6 text-white" />
          </button>
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
