'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  product: any;
  totalSold: number;
};

export const ProductSpecs = memo(({ product, totalSold }: Props) => {
  const {t} = useTranslation();
  const specs = [
    { label: 'product.description', value: product.categories?.[0]?.category?.name },
    { label: 'navigation.brands', value: product.brand?.name },
    { label: 'product.remainingProducts', value: totalSold },
    {
      label: 'product.shipFrom',
      value: product.shop?.addressShip
        ? `${product.shop.addressShip.address}, ${product.shop.addressShip.divisionPath?.WARD}, ${product.shop.addressShip.divisionPath?.DISTRICT}, ${product.shop.addressShip.divisionPath?.CITY}`
        : 'N/A',
    },
  ];

  return (
    <div className="bg-white dark:bg-black w-full p-4 space-y-2">
      <h2 className="uppercase font-medium mb-2">{t('product.description')}</h2>
      {specs.map((spec, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:gap-x-4 py-1">
          <span className="w-full sm:w-40 text-gray-400 text-sm">{t(spec.label)}:</span>
          <span className="text-sm sm:text-base">{spec.value}</span>
        </div>
      ))}
    </div>
  );
});

ProductSpecs.displayName = 'ProductSpecs';
