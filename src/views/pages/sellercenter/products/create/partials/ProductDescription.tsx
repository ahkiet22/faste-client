'use client';

import React, { RefObject } from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import RichTextEditor from './editor-desc';

interface ProductDescriptionProps {
  blockRefDescription: RefObject<HTMLDivElement | null>;
  control: Control<any, any, any>;
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
  editorRef: RefObject<any>;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  blockRefDescription,
  control,
  errors,
  editorRef,
}) => {
  return (
    <div ref={blockRefDescription} className="bg-white p-2 h-auto rounded-lg">
      <div className="text-lg font-semibold">Mô tả sản phẩm</div>

      <div className="grid gap-3">
        <label className="text-sm font-medium">
          <span className="text-destructive">*</span> Mô tả chi tiết sản phẩm
          (Không chèn link/địa chỉ/SĐT/website/logo nhà bán)
        </label>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div>
              <div>
                <RichTextEditor
                  ref={editorRef}
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              </div>
            </div>
          )}
        />

        {errors?.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
