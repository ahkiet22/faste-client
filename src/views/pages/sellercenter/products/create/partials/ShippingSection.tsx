'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { RefObject } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ShippingSectionProps {
  blockRefShipping: RefObject<HTMLDivElement | null>;
  errors?: FieldErrors<{
    name: string;
    categories: (number | undefined)[];
    brandId: number | undefined;
    images: any[];
    variants: {
      value: string;
      options: string[];
    }[];
    skus: {
      skuCode: string;
      price: number;
      attributes: any;
      quantity: number;
    }[];
    description: string;
    basePrice: number;
    status: NonNullable<'PUBLISHED' | 'DRAFT' | undefined>;
    slugId: string | undefined;
  }>;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({
  blockRefShipping,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div ref={blockRefShipping} className="bg-white p-2 h-auto rounded-lg">
      <div className="text-lg font-semibold">{t('sellercenter.products.create.shippingTitle')}</div>

      {/* Cân nặng */}
      <div className="grid gap-3">
        <label className="text-sm font-medium">
          <span className="text-destructive">*</span> {t('sellercenter.products.create.weight')}
        </label>
        <InputGroup className="max-w-40">
          <InputGroupInput
            placeholder={t('sellercenter.products.create.enterValue')}
            type="number"
            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
          />
          <InputGroupAddon align={'inline-end'} className="border-l px-2">
            gr
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Kích thước đóng gói */}
      <div className="grid gap-3">
        <label className="text-sm font-medium">
          {t('sellercenter.products.create.packageSize')} {t('sellercenter.products.create.packageSizeHint')}
        </label>
        <div className="flex gap-x-6">
          {['width', 'length', 'height'].map((dimension) => (
            <InputGroup className="max-w-40" key={dimension}>
              <InputGroupInput
                placeholder={t(`sellercenter.products.create.${dimension}`)}
                type="number"
                className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
              />
              <InputGroupAddon align={'inline-end'} className="border-l px-2">
                cm
              </InputGroupAddon>
            </InputGroup>
          ))}
        </div>
      </div>

      {/* Chọn đơn vị vận chuyển */}
      <div className="grid gap-3">
        <label className="text-sm font-medium">{t('sellercenter.products.create.shippingUnit')}</label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('sellercenter.products.create.shippingUnitPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="GHTK">GHTK</SelectItem>
              <SelectItem value="GHN">GHN</SelectItem>
              <SelectItem value="NINJAVAN">NINJAVAN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {errors?.status && (
        <p className="text-red-500 text-sm">{errors.status.message}</p>
      )}
    </div>
  );
};

export default ShippingSection;
