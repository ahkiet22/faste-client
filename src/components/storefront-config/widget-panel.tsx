'use client';

import { Plus, GripVertical, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Widget } from '@/types/widget';
import { Icon } from '@iconify/react/dist/iconify.js';
import { widgetIconLabel } from '@/configs/template';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface WidgetPanelProps {
  widgets: Widget[];
  onToggleWidget: (widgetId: string) => void;
  onReorderWidgets: (widgets: Widget[]) => void;
  onDeleteWidget: (widgetId: string) => void;
  onAddWidget: () => void;
}

export default function WidgetPanel({
  widgets,
  onToggleWidget,
  onReorderWidgets,
  onDeleteWidget,
  onAddWidget,
}: WidgetPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);

      const reorderedWidgets = arrayMove(widgets, oldIndex, newIndex).map(
        (widget, index) => ({
          ...widget,
          widgetIndex: index,
        }),
      );

      onReorderWidgets(reorderedWidgets);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Widget đang dùng</h2>
      </div>

      {/* Widget List */}
      <div className="h-[600px]">
        <ScrollArea className="flex-1 h-full">
          <div className="space-y-2 p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={widgets.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
              >
                {widgets.map((widget) => (
                  <SortableWidgetItem
                    key={widget.id}
                    widget={widget}
                    onToggle={() => onToggleWidget(widget.id)}
                    onDelete={() => onDeleteWidget(widget.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>
      </div>

      {/* Add Widget Button */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={onAddWidget}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm widget
        </Button>
      </div>
    </div>
  );
}

interface WidgetItemProps {
  widget: Widget;
  onToggle: () => void;
  onDelete: () => void;
}

function SortableWidgetItem({ widget, onToggle, onDelete }: WidgetItemProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Widget Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-lg">
        <Icon icon={widgetIconLabel[widget.type].icon} width={24} height={24} />
      </div>

      {/* Widget Label */}
      <div className="flex-1">
        <p className="text-sm">{widgetIconLabel[widget.type].label}</p>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-primary">
          {widget.isVisible ? 'Hiện' : 'Ẩn'}
        </span>
        <Switch checked={widget.isVisible} onCheckedChange={onToggle} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
