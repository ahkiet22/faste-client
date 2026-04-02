'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { availableWidgets, templateWidgets } from '@/configs/widget-template';
import { Widget, WidgetType } from '@/types/widget';
import { Icon } from '@iconify/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type AddWidgetsProps = {
  onAddWidget: (data: Omit<Widget, 'widgetIndex'>) => void;
};

export function AddWidgets(props: AddWidgetsProps) {
  const { onAddWidget } = props;
  const [open, setOpen] = useState(false);
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size={'lg'}
          className=" bg-transparent"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm widget
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        onEscapeKeyDown={() => setOpen(false)}
        onPointerDownOutside={() => setOpen(false)}
      >
        <SheetHeader>
          <SheetTitle>Mẫu thiết kế</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col overflow-auto px-4">
          {availableWidgets.map((item) => (
            <div key={item.title}>
              <div className="uppercase font-medium">{item.title}</div>
              <div className="grid grid-cols-3 gap-4 mb-2">
                {item.items.map((widget, index) => (
                  <div key={`${widget.type} ${index}`}>
                    <Button
                      onClick={() => {
                        onAddWidget(templateWidgets[widget.type]);
                      }}
                      variant="outline"
                      className="mb-2 flex items-center gap-2 w-24 h-24"
                    >
                      <Icon icon={widget.icon} width={24} height={24} />
                    </Button>
                    <div className="max-w-24 text-sm">{widget.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
