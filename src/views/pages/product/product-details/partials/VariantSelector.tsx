'use client';

import { memo } from 'react';

type TVariant = {
  value: string;
  options: string[];
};

type Props = {
  variants: TVariant[];
  selected: Record<string, string>;
  onSelect: (variantName: string, option: string) => void;
};

export const VariantSelector = memo(
  ({ variants, selected, onSelect }: Props) => {
    if (!variants || variants.length === 0) return null;

    return (
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-2">{variant.value}:</h3>
            <div className="flex gap-2 flex-wrap">
              {variant.options.map((opt) => {
                const isActive = selected[variant.value] === opt;
                return (
                  <button
                    key={opt}
                    className={`px-3 py-1 border rounded-lg hover:bg-gray-200 transition-colors
                    ${isActive ? 'bg-red-500 text-white border-red-500' : 'bg-white border-gray-300'}`}
                    onClick={() => onSelect(variant.value, opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

VariantSelector.displayName = 'VariantSelector';
