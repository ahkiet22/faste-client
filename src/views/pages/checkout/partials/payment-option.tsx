'use client';

import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

interface PaymentOptionProps {
  method: PaymentMethod;
  value: string;
}

export default function PaymentOption({ method, value }: PaymentOptionProps) {
  return (
    <Label className="cursor-pointer group">
      <div className="w-full">
        <div
          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            {/* Radio Button */}
            <div className="flex-shrink-0">
              <RadioGroupItem
                value={value}
                id={`payment-${method.id}-${method.label}`}
                className="w-5 h-5"
              />
            </div>

            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon
                icon={method.icon}
                width={24}
                height={24}
                className="text-primary"
              />
            </div>

            {/* Label */}
            <span className="font-medium text-foreground flex-1">
              {method.label}
            </span>

            {/* Checkmark Animation */}
            <div className="flex-shrink-0">
              <Icon
                icon="mdi:check-circle"
                width={20}
                height={20}
                className="text-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </Label>
  );
}
