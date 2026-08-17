'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@iconify/react';
import { iconsStatusOrder } from '@/configs/order';
import { useTranslation } from 'react-i18next';

interface OrderFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  paymentMethodFilter: string;
  setPaymentMethodFilter: (val: string) => void;
  paymentMethods: { value: string; label: string }[];
  onFilterChange: () => void;
}

export function OrderFilterBar({
  searchQuery,
  setSearchQuery,
  paymentMethodFilter,
  setPaymentMethodFilter,
  paymentMethods,
  onFilterChange,
}: OrderFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Icon
          icon={iconsStatusOrder.search}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
        />
        <Input
          placeholder={t('sellercenter.orders.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onFilterChange();
          }}
          className="pl-10"
        />
      </div>

      <Select
        value={paymentMethodFilter}
        onValueChange={(value) => {
          setPaymentMethodFilter(value);
          onFilterChange();
        }}
      >
        <SelectTrigger className="w-full md:w-[220px]">
          <SelectValue placeholder={t('sellercenter.orders.filterPayment')} />
        </SelectTrigger>
        <SelectContent>
          {paymentMethods.map((method) => (
            <SelectItem key={method.value} value={method.value}>
              {method.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}