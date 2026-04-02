'use client';

// -- React --
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// -- Component --
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { toastify } from '@/components/ToastNotification';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

// -- partials --
import { ProductFormSidebar } from './partials/product-form-sidebar';
import { ProductVariantTable } from './partials/ProductVariantTable';

// -- React hook form --
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetCategories } from '@/hooks/api/queries/useGetCategories';

// -- Icon --
import { Icon } from '@iconify/react';

import { generateSKUsV2 } from '@/helpers/generate-skus';
import { generateSlug } from '@/helpers/generate-slug';
import { keepPreviousData } from '@tanstack/react-query';
import { TSKUs, VariantsType } from '@/types/product';
import { createProductBySeller } from '@/services/product';

// -- Partial --
import ProductCharacteristics from './partials/ProductCharacteristics';
import ShippingSection from './partials/ShippingSection';
import ProductDescription from './partials/ProductDescription';
import InfoBasic from './partials/InfoBasic';
import { useTranslation } from 'react-i18next';

interface ICategory {
  id: string;
  name: string;
  children?: ICategory[];
}
type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (value: string) => void;
};

export const CreateProductPage = () => {
  const { t } = useTranslation();

  const productSchema = useMemo(() => yup.object().shape({
    name: yup
      .string()
      .min(3, t('sellercenter.products.create.nameMinLen'))
      .max(255, t('sellercenter.products.create.nameMaxLen'))
      .required(t('sellercenter.products.create.nameRequired')),
    categories: yup
      .array()
      .of(yup.number().integer('ID danh mục phải là số nguyên'))
      .required(t('sellercenter.products.create.categoryRequired')),
    brandId: yup.number().integer('ID thương hiệu phải là số nguyên'),
    images: yup.array().required(t('sellercenter.products.create.imagesRequired')),
    variants: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required('Giá trị thuộc tính là bắt buộc'),
          options: yup
            .array()
            .of(yup.string().required('Tùy chọn không được rỗng'))
            .required('Danh sách tùy chọn là bắt buộc'),
        }),
      )
      .required('Danh sách thuộc tính sản phẩm là bắt buộc'),

    skus: yup
      .array()
      .of(
        yup.object().shape({
          skuCode: yup.string().required('Mã SKU là bắt buộc'),
          price: yup
            .number()
            .required('Giá SKU là bắt buộc'),
          attributes: yup.object().required('Thuộc tính SKU là bắt buộc'),
          quantity: yup
            .number()
            .integer('Số lượng phải là số nguyên')
            .min(0, 'Số lượng không thể âm')
            .required('Số lượng SKU là bắt buộc'),
        }),
      )
      .required('Danh sách SKU sản phẩm là bắt buộc'),
    description: yup.string().required('Mô tả sản phẩm là bắt buộc'),
    basePrice: yup
      .number()
      .required(t('sellercenter.products.create.basePriceRequired')),
    status: yup
      .mixed<'PUBLISHED' | 'DRAFT'>()
      .oneOf(['PUBLISHED', 'DRAFT'], 'Trạng thái không hợp lệ')
      .required('Trạng thái là bắt buộc'),
    slugId: yup.string(),
  }), [t]);
  const blockRefs = {
    basic: useRef<HTMLDivElement>(null),
    characteristics: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    description: useRef<HTMLDivElement>(null),
    shipping: useRef<HTMLDivElement>(null),
  };

  type BlockKey = keyof typeof blockRefs;

  const scrollToBlock = useCallback((key: BlockKey) => {
    blockRefs[key].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editorRef = useRef<RichTextEditorHandle>(null);
  // -- State --
  const [editorContent, setEditorContent] = useState<string>('');
  const [variants, setVariants] = useState<VariantsType>([]);
  const [skus, setSkus] = useState<TSKUs[]>([]);
  const [applyValue, setApplyValue] = useState({
    price: '',
    quantity: '',
  });
  const router = useRouter();

  const { data: categorys, isLoading } = useGetCategories(
    {
      page: 1,
      limit: 10,
    },
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );

  const { data: brandData, isLoading: isLoadingBrand } = useGetCategories(
    {
      page: 1,
      limit: 10,
    },
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      categories: [] as number[],
      brandId: undefined,
      images: ['https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg'],
      variants: [] as VariantsType,
      skus: [] as TSKUs[],
      description: '',
      basePrice: 0,
      status: 'DRAFT',
      slugId: '',
    },
  });

  // -- onSubmit --
  const onSubmit = async (data: any) => {
    try {
      if (!Object.keys(errors).length) {
        const res = await createProductBySeller(data);
        if (res.statusCode === 201) {
          toastify.success('product', 'Create product successfully');
          router.refresh();
        } else {
          toastify.error('product', 'An error occurred, please try again');
        }
      }
    } catch (error) {
      console.log(error);
      toastify.error('product', 'An error occurred while submitting the form');
    }
  };

  const filterCategories = (
    categories: {
      id: string;
      name: string;
      parentCategoryId: string | null;
      children: any;
    }[],
  ): ICategory[] => {
    if (!categories) {
      return [];
    }
    const parentCategories = categories.filter(
      (category) => category.parentCategoryId === null,
    );

    parentCategories.forEach((parentCategory) => {
      parentCategory.children = categories
        .filter((category) => category.parentCategoryId === parentCategory.id)
        .map((category) => {
          const children = categories.filter(
            (subCategory) => subCategory.parentCategoryId === category.id,
          );
          return {
            ...category,
            children: children.length > 0 ? children : undefined,
          };
        });
    });

    return parentCategories.map((parentCategory) => ({
      id: parentCategory.id,
      name: parentCategory.name,
      children: parentCategory.children,
    }));
  };

  const handleAddVariants = useCallback(() => {
    setVariants((prev) => [...prev, { value: '', options: [''] }]);
  }, []);

  // --- Handle ---
  const handleChangeVariantValue = (index: number, value: string) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[index].value = value;
      return updatedVariants;
    });
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    newOption: string,
  ) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[fieldIndex].options[optionIndex] = newOption;
      return updated;
    });
  };

  const handleAddOption = (fieldIndex: number) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[fieldIndex].options.push('');
      return updated;
    });
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[fieldIndex].options.splice(optionIndex, 1);
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyAllSkus = () => {
    setSkus((prev) => {
      const newSkus = prev.map((sku) => ({
        ...sku,
        price: applyValue.price ? Number(applyValue.price) : sku.price,
        quantity: applyValue.quantity
          ? Number(applyValue.quantity)
          : sku.quantity,
      }));
      setValue('skus', newSkus, { shouldValidate: false });
      return newSkus;
    });
  };

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );

      const currentImages = getValues('images') || [];

      setValue('images', [...currentImages, ...fileArray]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getValues('images')],
  );

  const handleDeleteImage = useCallback(
    (index: number) => {
      const currentImages = getValues('images') || [];
      const filterImages = currentImages.filter(
        (_, indexImage) => indexImage !== index,
      );

      setValue('images', filterImages);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getValues('images')],
  );
  // --- End Handle ---

  useEffect(() => {
    const name = watch('name');
    if (name) {
      setValue('slugId', generateSlug(name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues('name')]);

  useEffect(() => {
    const images = getValues('images');
    return () => {
      images?.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues('images')]);

  useEffect(() => {
    if (variants.length > 0) {
      const filteredVariants = variants
        .map((variant) => {
          if (variant.value === '') return null;

          const newOptions = variant.options.filter((option) => option !== '');

          return {
            ...variant,
            options: newOptions,
          };
        })
        .filter((variant) => variant !== null);
      const skus = generateSKUsV2(filteredVariants);
      setSkus(skus);
      setValue('variants', filteredVariants);
      setValue('skus', skus);
    } else {
      if (skus.length > 0) {
        setSkus([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  console.log('==== RENDER CREATE PRODUCT');

  return (
    <div className="w-full">
      {isLoading || (isLoadingBrand && <LoadingDialog isLoading />)}
      <div className="flex justify-between gap-x-4">
        <form
          className="w-3/4 flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* <div
            ref={blockRefs.basic}
            className="bg-white p-2 h-auto rounded-lg space-y-6"
          >
            <div className="text-lg font-semibold">Thông tin cơ bản</div>
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                <span className="text-destructive">*</span> Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    type="name"
                    placeholder="m@example.com"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {categorys && !isLoading && (
              <div>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <CategorySelector
                      {...field}
                      categories={filterCategories(categorys)}
                      control={control}
                      errors={errors}
                      onChange={(selectedCategories: string[]) =>
                        field.onChange(selectedCategories)
                      } // Cập nhật giá trị khi chọn danh mục
                    />
                  )}
                />
                {errors.categories && (
                  <p className="text-red-500 text-sm">
                    {errors.categories.message}
                  </p>
                )}
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="brandId">Thương hiệu</Label>
              <Controller
                name="brandId"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      value={String(field.value)}
                      onValueChange={(e) => {
                        field.onChange(Number(e));
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {brandData &&
                            brandData.map(
                              (item: { id: number; name: string }) => (
                                <SelectItem
                                  key={item.id}
                                  value={String(item.id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ),
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.brandId && (
                <p className="text-red-500 text-sm">{errors.brandId.message}</p>
              )}
            </div>

            <div className="grid gap-3 w-[180px]">
              <label className="text-sm font-medium">Slug</label>
              <Controller
                name="slugId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="slugId"
                    type="text"
                    placeholder="Nhập vào"
                  />
                )}
              />
              {errors.slugId && (
                <p className="text-red-500 text-sm">{errors.slugId.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="brandId">{`Ảnh (${watch('images')?.length > 0 ? watch('images').length : 0}/8)`}</Label>
              <div className="flex gap-x-2">
                {watch('images') &&
                  watch('images').map((image, index) => (
                    <div
                      className="group w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors relative"
                      key={index}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={image ? image : '/placeholder.svg'}
                        alt={`product`}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute bottom-0 cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex gap-x-1.5 justify-center bg-black/60 rounded-b-lg rounded-bl-lg backdrop-blur-md w-full overflow-hidden">
                        <Icon
                          icon={'lsicon:view-outline'}
                          width={18}
                          height={18}
                          className="text-blue-500"
                        />
                        <Icon
                          icon={'material-symbols:close'}
                          width={18}
                          height={18}
                          className="text-red-500"
                          onClick={() => handleDeleteImage(index)}
                        />
                      </div>
                    </div>
                  ))}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e)}
                  />
                  <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors">
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  </div>
                </label>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images.message}</p>
              )}
            </div>
          </div> */}

          <InfoBasic
            blockRefBasic={blockRefs.basic}
            brandData={brandData}
            categorys={categorys}
            control={control}
            errors={errors}
            getValues={getValues}
            handleDeleteImage={handleDeleteImage}
            handleImageChange={handleImageChange}
          />

          <ProductCharacteristics
            blockRefCharacteristics={blockRefs.characteristics}
          />

          <div
            ref={blockRefs.pricing}
            className="bg-white p-4 h-auto rounded-lg flex flex-col gap-y-4"
          >
            <div className="text-lg font-semibold">
              {t('sellercenter.products.create.pricingAndStock')}
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-medium">
                <span className="text-destructive">*</span> {t('sellercenter.products.create.basePrice')}
              </label>
              <Controller
                name="basePrice"
                control={control}
                render={({ field }) => (
                  <InputGroup className="max-w-3xs">
                    {/* <InputGroupInput
                      {...field}
                      max={120000000}
                      id="basePrice"
                      type="number"
                      placeholder="Nhập vào"
                      
                    /> */}
                    <Input
                      {...field}
                      max={120000000}
                      min={0}
                      id="basePrice"
                      type="number"
                      placeholder="Nhập vào"
                      className="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
                    />
                    <InputGroupAddon>đ</InputGroupAddon>
                  </InputGroup>
                )}
              />
              {errors.basePrice && (
                <p className="text-red-500 text-sm">
                  {errors.basePrice.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-medium">{t('sellercenter.products.create.stock')}</label>
              <Input
                max={9999}
                defaultValue={0}
                id="quantity"
                type="number"
                placeholder="Nhập vào"
                className="max-w-3xs"
              />
            </div>

            <div className="flex flex-col gap-y-4">
              {variants.map((variant, indexVariant) => (
                <div
                  className="bg-[#e6f7ff] outline-1 px-2 py-4 flex flex-col gap-y-5 rounded-sm relative"
                  key={indexVariant}
                >
                  <div className="flex items-center gap-x-2">
                    <label className="text-sm font-medium max-w-14">
                      {t('sellercenter.products.create.variantType')} {indexVariant + 1}
                    </label>
                    <Input
                      value={variant.value}
                      minLength={1}
                      type="text"
                      className="max-w-80"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        handleChangeVariantValue(indexVariant, newValue);
                      }}
                    />
                    <Button
                      className="text-red-500 hover:text-red-500 absolute top-2 right-2 cursor-pointer bg-transparent"
                      variant={'outline'}
                      onClick={() => handleRemoveVariant(indexVariant)}
                    >
                      <Icon
                        icon={'material-symbols:close'}
                        width={18}
                        height={18}
                      />
                    </Button>
                  </div>
                  {variant.options.map((option, indexOption) => (
                    <div
                      className="flex items-center gap-x-2 "
                      key={`${indexVariant}-${indexOption}`}
                    >
                      <label className="text-sm font-medium max-w-14">
                        {t('sellercenter.products.create.variantOption')}
                      </label>
                      <Input
                        value={option}
                        minLength={1}
                        type="text"
                        className="max-w-80"
                        onChange={(e) => {
                          if (!option) {
                            handleAddOption(indexVariant);
                          }
                          handleOptionChange(
                            indexVariant,
                            indexOption,
                            e.target.value,
                          );
                        }}
                      />
                      {(indexOption === 0 ||
                        indexOption !== variant.options.length - 1) && (
                        <Button
                          className={`p-0 ${
                            indexOption === 0
                              ? 'cursor-not-allowed !pointer-events-auto'
                              : 'cursor-pointer'
                          }`}
                          disabled={indexOption === 0}
                          variant="outline"
                          onClick={() =>
                            handleRemoveOption(indexVariant, indexOption)
                          }
                        >
                          <Icon
                            icon="material-symbols:delete-outline"
                            width={24}
                            height={24}
                            className="text-red-500"
                          />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {variants.length < 2 && (
              <button
                type="button"
                className="rounded-sm border border-dashed border-gray-300 bg-white px-1.5 py-1 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 w-fit"
                onClick={handleAddVariants}
              >
                + {t('sellercenter.products.create.addVariant')}
              </button>
            )}
            {errors.variants && (
              <p className="text-red-500 text-sm">{errors.variants.message}</p>
            )}

            {skus.length > 0 && (
              <>
                <div className="font-semibold">{t('sellercenter.products.create.variantList')}</div>
                <div className="flex justify-between">
                  <div className="flex">
                    <InputGroup>
                      <InputGroupInput
                        placeholder={t('sellercenter.products.create.price')}
                        onChange={(e) =>
                          setApplyValue((prev) => ({
                            ...prev,
                            ['price']: e.target.value,
                          }))
                        }
                      />
                      <InputGroupAddon>đ</InputGroupAddon>
                    </InputGroup>
                    <Input
                      placeholder={t('sellercenter.products.create.stock')}
                      onChange={(e) =>
                        setApplyValue((prev) => ({
                          ...prev,
                          ['quantity']: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={handleApplyAllSkus}
                  >
                    {t('sellercenter.products.create.applyToAll')}
                  </Button>
                </div>
                <ProductVariantTable setSkus={setSkus} skusData={skus} />
              </>
            )}
            {errors.skus && (
              <p className="text-red-500 text-sm">{errors.skus.message}</p>
            )}
          </div>
          <ProductDescription
            blockRefDescription={blockRefs.description}
            control={control}
            errors={errors}
            editorRef={editorRef}
          />
          <ShippingSection
            blockRefShipping={blockRefs.shipping}
            errors={errors}
          />
          <div className="sticky bottom-0 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white flex justify-end gap-4 p-4 z-50">
            <Button
              variant={'outline'}
              type="submit"
              onClick={() => setValue('status', 'DRAFT')}
              className="cursor-pointer"
            >
              {t('sellercenter.products.create.saveDraft')}
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setValue('status', 'PUBLISHED');
              }}
              className="cursor-pointer"
            >
              {t('sellercenter.products.create.publish')}
            </Button>
          </div>
        </form>
        <div className="w-1/4 relative">
          <div className="sticky top-4">
            <ProductFormSidebar scrollToBlock={scrollToBlock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
