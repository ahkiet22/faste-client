'use client';

// -- React --
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

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


// -- React hook form & Validation --
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// -- Services & Hooks --
import { useGetCategories } from '@/hooks/api/queries/useGetCategories';
// Giả định bạn có hook/service fetch & update sản phẩm:
import { getProductById, updateProductBySeller } from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';
import { uploadMultipleFiles } from '@/services/media.service';

// -- Icon & Helpers --
import { Icon } from '@iconify/react';
import { generateSKUsV2 } from '@/helpers/generate-skus';
import { generateSlug } from '@/helpers/generate-slug';
import { keepPreviousData } from '@tanstack/react-query';
import { TSKUs, VariantsType } from '@/types/product';
import { useTranslation } from 'react-i18next';
import ProductCharacteristics from '../create/partials/ProductCharacteristics';
import InfoBasic from '../create/partials/InfoBasic';
import { ProductFormSidebar } from '../create/partials/product-form-sidebar';
import ShippingSection from '../create/partials/ShippingSection';
import ProductDescription from '../create/partials/ProductDescription';
import { ProductVariantTable } from '../create/partials/ProductVariantTable';

interface ICategory {
  id: string;
  name: string;
  children?: ICategory[];
}

type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (value: string) => void;
};

export const EditProductPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const productSchema = useMemo(
    () =>
      yup.object().shape({
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
              price: yup.number().required('Giá SKU là bắt buộc'),
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
      }),
    [t],
  );

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
  }, []);

  const editorRef = useRef<RichTextEditorHandle>(null);

  // -- States --
  const [variants, setVariants] = useState<VariantsType>([]);
  const [skus, setSkus] = useState<TSKUs[]>([]);
  const [applyValue, setApplyValue] = useState({
    price: '',
    quantity: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -- Fetch Detail Product --
  const { data: productDetail, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: async () => await getProductById(productId),
    enabled: !!productId,
    select: (data) => data?.data,
  });

  console.log("PARAMS ID", productDetail)


  // -- Fetch Categories & Brands --
  const { data: categorys, isLoading: isLoadingCategories } = useGetCategories(
    { page: 1, limit: 10 },
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );

  const { data: brandData, isLoading: isLoadingBrand } = useGetCategories(
    { page: 1, limit: 10 },
    {
      select: (data) => data.data,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  );

  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      categories: [] as number[],
      brandId: undefined,
      images: [] as { file?: File; previewUrl: string }[],
      variants: [] as VariantsType,
      skus: [] as TSKUs[],
      description: '',
      basePrice: 0,
      status: 'DRAFT' as 'PUBLISHED' | 'DRAFT',
      slugId: '',
    },
  });

  // -- Populate Data when productDetail is available --
  useEffect(() => {
    if (productDetail) {
      reset({
        name: productDetail.name || '',
        categories: productDetail.categories || [],
        brandId: productDetail.brandId,
        images: (productDetail.images || []).map((imgUrl: string) => ({
          previewUrl: imgUrl,
        })),
        description: productDetail.description || '',
        basePrice: productDetail.basePrice || 0,
        status: productDetail.status || 'DRAFT',
        slugId: productDetail.slugId || '',
        variants: productDetail.variants || [],
        skus: productDetail.skus || [],
      });

      if (productDetail.variants) setVariants(productDetail.variants);
      if (productDetail.skus) setSkus(productDetail.skus);
    }
  }, [productDetail, reset]);

  // -- onSubmit Handler --
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (!Object.keys(errors).length) {
        const currentImages = getValues('images') || [];
        const newFiles = currentImages
          .filter((img: any) => img.file)
          .map((img: any) => img.file);

        let uploadedUrls: string[] = [];
        if (newFiles.length > 0) {
          setIsUploading(true);
          try {
            const uploadResults = await uploadMultipleFiles(newFiles, true);
            uploadedUrls = uploadResults.map((res: any) => res.url);
          } catch (error) {
            toastify.error('Images', 'Failed to upload product images');
            setIsUploading(false);
            setIsSubmitting(false);
            return;
          } finally {
            setIsUploading(false);
          }
        }

        let uploadIndex = 0;
        const finalImageUrls = currentImages.map((img: any) => {
          if (img.file) {
            return uploadedUrls[uploadIndex++];
          }
          return img.previewUrl;
        });

        const payload = {
          ...data,
          images: finalImageUrls,
        };

        const res = await updateProductBySeller(productId, payload);
        if (res.statusCode === 200 || res.statusCode === 204) {
          toastify.success('product', 'Update product successfully');
          router.refresh();
        } else {
          toastify.error('product', 'An error occurred, please try again');
        }
      }
    } catch (error) {
      toastify.error('product', 'An error occurred while updating the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariants = useCallback(() => {
    setVariants((prev) => [...prev, { value: '', options: [''] }]);
  }, []);

  // --- Handlers for Variants & SKUs ---
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

      const currentImages = getValues('images') || [];
      const remainingSlots = 8 - currentImages.length;
      if (remainingSlots <= 0) {
        toastify.error('Images', 'You can only upload up to 8 images');
        return;
      }

      const filesToSelect = Array.from(files).slice(0, remainingSlots);
      if (Array.from(files).length > remainingSlots) {
        toastify.info('Images', `Only the first ${remainingSlots} images will be selected (max 8)`);
      }

      const newItems = filesToSelect.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setValue('images', [...currentImages, ...newItems]);
    },
    [getValues, setValue],
  );

  const handleDeleteImage = useCallback(
    (index: number) => {
      const currentImages = getValues('images') || [];
      const itemToDelete = currentImages[index];
      if (itemToDelete?.file) {
        URL.revokeObjectURL(itemToDelete.previewUrl);
      }
      const filterImages = currentImages.filter((_, i) => i !== index);
      setValue('images', filterImages);
    },
    [getValues, setValue],
  );

  useEffect(() => {
    const name = watch('name');
    if (name) {
      setValue('slugId', generateSlug(name));
    }
  }, [watch('name'), setValue]);

  useEffect(() => {
    const images = getValues('images');
    return () => {
      images?.forEach((img: any) => {
        if (img?.file) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [getValues]);

  useEffect(() => {
    if (variants.length > 0) {
      const filteredVariants = variants
        .map((variant) => {
          if (variant.value === '') return null;
          const newOptions = variant.options.filter((option) => option !== '');
          return { ...variant, options: newOptions };
        })
        .filter((variant): variant is NonNullable<typeof variant> => variant !== null);

      const generatedSkus = generateSKUsV2(filteredVariants);
      setSkus(generatedSkus);
      setValue('variants', filteredVariants);
      setValue('skus', generatedSkus);
    } else {
      if (skus.length > 0) {
        setSkus([]);
      }
    }
  }, [variants, setValue]);

  const isLoadingPage = isLoadingCategories || isLoadingBrand || isLoadingProduct || isSubmitting || isUploading;

  return (
    <div className="w-full">
      {isLoadingPage && <LoadingDialog isLoading />}

      <div className="flex justify-between gap-x-4">
        <form
          className="w-3/4 flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InfoBasic
            blockRefBasic={blockRefs.basic}
            brandData={brandData}
            categorys={categorys}
            control={control}
            errors={errors}
            getValues={getValues}
            handleDeleteImage={handleDeleteImage}
            handleImageChange={handleImageChange}
            isUploading={isUploading}
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
                <span className="text-destructive">*</span>{' '}
                {t('sellercenter.products.create.basePrice')}
              </label>
              <Controller
                name="basePrice"
                control={control}
                render={({ field }) => (
                  <InputGroup className="max-w-3xs">
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
              <label className="text-sm font-medium">
                {t('sellercenter.products.create.stock')}
              </label>
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
                      onChange={(e) =>
                        handleChangeVariantValue(indexVariant, e.target.value)
                      }
                    />
                    <Button
                      type="button"
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
                      className="flex items-center gap-x-2"
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
                          type="button"
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
                <div className="font-semibold">
                  {t('sellercenter.products.create.variantList')}
                </div>
                <div className="flex justify-between">
                  <div className="flex">
                    <InputGroup>
                      <InputGroupInput
                        placeholder={t('sellercenter.products.create.price')}
                        onChange={(e) =>
                          setApplyValue((prev) => ({
                            ...prev,
                            price: e.target.value,
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
                          quantity: e.target.value,
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
            control={control as any}
            errors={errors}
            editorRef={editorRef}
          />

          <ShippingSection
            blockRefShipping={blockRefs.shipping}
            errors={errors}
          />

          {/* Action Bar */}
          <div className="sticky bottom-0 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white flex justify-end gap-4 p-4 z-50">
            <Button
              variant={'outline'}
              type="submit"
              onClick={() => setValue('status', 'DRAFT')}
              className="cursor-pointer"
            >
              Lưu bản nháp
            </Button>
            <Button
              type="submit"
              onClick={() => setValue('status', 'PUBLISHED')}
              className="cursor-pointer"
            >
              Cập nhật sản phẩm
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

export default EditProductPage;