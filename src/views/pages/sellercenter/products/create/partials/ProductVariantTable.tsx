'use client';

import type React from 'react';

import { Dispatch, SetStateAction, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { TSKUs } from '@/types/product';
import { useTranslation } from 'react-i18next';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

type TProps = {
  skusData: TSKUs[];
  setSkus: Dispatch<SetStateAction<TSKUs[]>>;
};

export function ProductVariantTable(props: TProps) {
  const { setSkus, skusData } = props;
  const { t } = useTranslation();

  // const handleVariantChange = (
  //   id: string,
  //   field: keyof TSKUs,
  //   value: string,
  // ) => {
  //   setSkus((prev) => {
  //     const updated = [...prev];
  //     updated[Number(id)][String(field)] = value;
  //     return updated;
  //   })
  //   setVariants(
  //     variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
  //   );
  // };

  const handleVariantChange = <K extends keyof TSKUs>(
    id: string,
    field: K,
    value: TSKUs[K] extends number ? number : string,
  ) => {
    setSkus((prev) => {
      const updated = [...prev];
      const index = Number(id);
      updated[index][field] = value as TSKUs[K];
      return updated;
    });
  };

  const handleImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleVariantChange(id, 'image', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  let attributeKeys: any[] = [];
  if (skusData[0]?.attributes) {
    // console.log(skusData[0].attributes);
    attributeKeys = Object.keys(skusData[0].attributes);
  }

  const renderedAttributeKeyOne = new Set<string>();

  console.log("RENDER VARIANR TABLE")

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-24">
                <span className="text-destructive">*</span>
                {attributeKeys[0]}
              </th>
              {attributeKeys[1] && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-24">
                  {attributeKeys[1]}
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                <span className="text-destructive">*</span> {t('sellercenter.products.create.price')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                <span className="text-destructive">*</span> {t('sellercenter.products.create.stock')}
                <span
                  className="ml-1 text-xs text-muted-foreground cursor-help"
                  title="Warehouse quantity"
                >
                  ⓘ
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                {t('sellercenter.products.create.variantSku')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                {t('sellercenter.products.create.gtin')}
                <span
                  className="ml-1 text-xs text-muted-foreground cursor-help"
                  title="Global Trade Item Number"
                >
                  ⓘ
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {skusData.map((sku, index) => {
              const sizeAttributeKeyOne = skusData.filter(
                (s) =>
                  s.attributes[attributeKeys[0]] ===
                  sku.attributes[attributeKeys[0]],
              );
              // const isFirstColorInSize = sizeVariants[0].id === variant.id;
              // console.log(sku);
              const shouldRenderImage = !renderedAttributeKeyOne.has(
                sku.attributes[attributeKeys[0]],
              );

              if (shouldRenderImage && !!sku.attributes[attributeKeys[0]]) {
                // console.log(sku)
                // console.log(!!sku.attributes[attributeKeys[0]], sku.attributes[attributeKeys[0]])
                renderedAttributeKeyOne.add(sku.attributes[attributeKeys[0]]);
              }

              return (
                // {/* attributeKeys[0] & image */}
                <tr
                  key={sku.skuCode}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  {shouldRenderImage && (
                    <td
                      rowSpan={sizeAttributeKeyOne.length}
                      className="px-4 py-4 text-sm font-semibold text-foreground border-r align-top"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-lg">
                          {sku.attributes[attributeKeys[0]]}
                        </span>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(String(index), e)
                            }
                          />
                          <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors">
                            {sku.image ? (
                              <Image
                                width={100}
                                height={100}
                                src={sku.image || '/placeholder.svg'}
                                alt={`${sku.attributes[attributeKeys[0]]}-${sku.attributes[attributeKeys[1]]}`}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <ImagePlus className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                        </label>
                      </div>
                    </td>
                  )}

                  {/* attributeKeys[1] */}
                  {attributeKeys[1] && (
                    <td className="px-4 py-4 text-sm border-r">
                      <span className="text-foreground">
                        {sku.attributes[attributeKeys[1]]}
                      </span>
                    </td>
                  )}

                  {/* price */}
                  <td className="px-4 py-4 text-sm border-r">
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        placeholder={t('sellercenter.products.create.enterValue')}
                        min={0}
                        max={120000000}
                        value={sku.price}
                        onChange={(e) =>
                          handleVariantChange(
                            String(index),
                            'price',
                            Number(e.target.value),
                          )
                        }
                        className="w-full"
                      />
                      <InputGroupAddon>đ</InputGroupAddon>
                    </InputGroup>
                  </td>

                  {/* quantity */}
                  <td className="px-4 py-4 text-sm border-r">
                    <Input
                      type="number"
                      placeholder="0"
                      max={9999}
                      min={0}
                      value={sku.quantity}
                      onChange={(e) =>
                        handleVariantChange(
                          String(index),
                          'quantity',
                          Number(e.target.value),
                        )
                      }
                      className="w-full"
                    />
                  </td>

                  {/* skuCode */}
                  <td className="px-4 py-4 text-sm border-r">
                    <Input
                      type="text"
                      placeholder={t('sellercenter.products.create.enterValue')}
                      value={sku.skuCode}
                      onChange={(e) =>
                        handleVariantChange(
                          String(index),
                          'skuCode',
                          e.target.value,
                        )
                      }
                      className="w-full"
                    />
                  </td>

                  <td className="px-4 py-4 text-sm border-r">
                    <Input
                      type="text"
                      placeholder={t('sellercenter.products.create.enterValue')}
                      value={''}
                      // onChange={(e) =>
                      //   handleVariantChange(variant.id, 'gtin', e.target.value)
                      // }
                      className="w-full"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
