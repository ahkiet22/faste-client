'use client';

import { Card } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithExchange } from '@/utils';

interface DeliveryMethod {
  id: number;
  name: string;
  estimatedTime: string;
  cost: number;
  provider: string;
}

interface DeliveryOptionProps {
  method: DeliveryMethod;
  isSelected: boolean;
  value: string;
}

export default function DeliveryOption({
  method,
  isSelected,
  value,
}: DeliveryOptionProps) {
  const { i18n, t } = useTranslation();
  return (
    <Label className="cursor-pointer group max-">
      <div>
        <Card
          className={`p-4 transition-all duration-300 border-2 backdrop-blur-sm ${
            isSelected
              ? 'border-primary'
              : 'border-border/50 bg-gradient-to-br from-muted/30 to-transparent hover:border-primary/50 hover:shadow-md'
          }`}
        >
          <div className="flex gap-3">
            {/* Radio Button with Animation */}
            <div className="mt-1">
              <RadioGroupItem
                value={value}
                id={`delivery-${method.id}`}
                className="w-5 h-5"
              />
            </div>

            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {t(method.name)}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon
                      icon="mdi:clock-outline"
                      width={16}
                      height={16}
                      className="text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t(method.estimatedTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {formatCurrencyWithExchange(method.cost, {
                      language: i18n.language as 'vi' | 'en' | 'cn' | 'kr',
                    })}
                  </p>
                  <p className="max-w-[100px] text-xs text-muted-foreground">
                    {t(method.provider)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Label>
  );
}
