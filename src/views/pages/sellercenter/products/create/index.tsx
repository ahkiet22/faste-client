'use client';

// -- React --
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// -- Component --
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

// -- partials --
import { ProductFormSidebar } from './partials/product-form-sidebar';
import { CategorySelector } from './partials/category-ui';
import RichTextEditor from './partials/editor-desc';
import { ProductVariantTable } from './partials/ProductVariantTable';

// -- React hook form --
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetCategories } from '@/hooks/queries/useGetCategories';

import { keepPreviousData } from '@tanstack/react-query';
import { ImagePlus } from 'lucide-react';
import { getAllBrands } from '@/services/brand';
import { Icon } from '@iconify/react/dist/iconify.js';
import { TSKUs, VariantsType } from '@/types/product';
import { generateSKUsV2 } from '@/helpers/generate-skus';
import { toastify } from '@/components/ToastNotification';
import { createProductBySeller } from '@/services/product';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/helpers/generate-slug';

interface ICategory {
  id: string;
  name: string;
  children?: ICategory[];
}
type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (value: string) => void;
};

const productSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(255, 'Tên sản phẩm không được vượt quá 255 ký tự')
    .required('Tên sản phẩm là bắt buộc'),
  categories: yup
    .array()
    .of(yup.number().integer('ID danh mục phải là số nguyên'))
    .required('Danh mục sản phẩm là bắt buộc'),
  brandId: yup.number().integer('ID thương hiệu phải là số nguyên'),
  images: yup.array().required('Danh sách hình ảnh là bắt buộc'),
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
          // .positive('Giá SKU phải lớn hơn 0')
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
    // .positive('Giá cơ bản phải lớn hơn 0')
    .required('Giá cơ bản là bắt buộc'),
  status: yup
    .mixed<'PUBLISHED' | 'DRAFT'>()
    .oneOf(['PUBLISHED', 'DRAFT'], 'Trạng thái không hợp lệ')
    .required('Trạng thái là bắt buộc'),
  slugId: yup.string(),
});

export const CreateProductPage = () => {
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
  const [brandData, setBrandData] = useState<[]>([]);
  const [variants, setVariants] = useState<VariantsType>([]);
  const [skus, setSkus] = useState<TSKUs[]>([]);
  const [applyValue, setApplyValue] = useState({
    price: '',
    quantity: '',
  });
  const router = useRouter();

  // -- fetch data --
  const fetchBrandData = async () => {
    try {
      const res = await getAllBrands();
      if (res.statusCode === 200) {
        setBrandData(res.data.data);
      }
    } catch (error) {}
  };

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

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      categories: [],
      brandId: undefined,
      images: ['https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg'],
      variants: [],
      skus: [],
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
          // Đưa danh mục con có con tiếp theo vào children
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    const currentImages = watch('images') || [];

    setValue('images', [...currentImages, ...fileArray]);
  };

  const handleDeleteImage = (index: number) => {
    const currentImages = watch('images') || [];
    const filterImages = currentImages.filter(
      (_, indexImage) => indexImage !== index,
    );

    setValue('images', filterImages);
  };
  // --- End Handle ---

  // useEffect
  useEffect(() => {
    fetchBrandData();
  }, []);

  useEffect(() => {
    const name = watch('name');
    if (name) {
      setValue('slugId', generateSlug(name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('name')]);

  useEffect(() => {
    const images = watch('images');
    return () => {
      images?.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('images')]);

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

  return (
    <div className="w-full">
      <div className="flex justify-between gap-x-4">
        <form
          className="w-3/4 flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
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
          </div>
          <div
            ref={blockRefs.characteristics}
            className="bg-white p-2 h-auto rounded-lg"
          >
            <div className="text-lg font-semibold">Đặc tính sản phẩm</div>
            <div className="w-full grid grid-cols-2 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="p-2 flex flex-col gap-y-2">
                  <Label>{`Đặc tính ${index}`}</Label>
                  <Input value={index} placeholder="Nhập vào" />
                </div>
              ))}
            </div>
          </div>
          <div
            ref={blockRefs.pricing}
            className="bg-white p-4 h-auto rounded-lg flex flex-col gap-y-4"
          >
            <div className="text-lg font-semibold">
              Giá bán, Kho hàng và Biến thể
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-medium">
                <span className="text-destructive">*</span> Giá cơ bản
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
              <label className="text-sm font-medium">Kho hàng</label>
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
                      Phân loại {indexVariant + 1}
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
                        Tùy chọn
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
                className="rounded-sm border border-dashed border-gray-300 bg-white px-1.5 py-1 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500"
                onClick={handleAddVariants}
              >
                + Thêm biến thể
              </button>
            )}
            {errors.variants && (
              <p className="text-red-500 text-sm">{errors.variants.message}</p>
            )}

            {skus.length > 0 && (
              <>
                <div className="font-semibold">Danh sách phân loại hàng</div>
                <div className="flex justify-between">
                  <div className="flex">
                    <InputGroup>
                      <InputGroupInput
                        placeholder="Giá"
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
                      placeholder="Kho hàng"
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
                    Áp dụng cho tất cả
                  </Button>
                </div>
                <ProductVariantTable setSkus={setSkus} skusData={skus} />
              </>
            )}
            {errors.skus && (
              <p className="text-red-500 text-sm">{errors.skus.message}</p>
            )}
          </div>
          <div
            ref={blockRefs.description}
            className="bg-white p-2 h-auto rounded-lg"
          >
            <div className="text-lg font-semibold">Mô tả sản phẩm</div>
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                <span className="text-destructive">*</span> Mô tả chi tiết sản
                phẩm (Không chèn link/địa chỉ/SĐT/website/logo nhà bán)
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => {
                  return (
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
                  );
                }}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div
            ref={blockRefs.shipping}
            className="bg-white p-2 h-auto rounded-lg"
          >
            <div className="text-lg font-semibold">Vận chuyển và bảo hành</div>
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                <span className="text-destructive">*</span> Căn nặng (Sau khi
                đóng gói)
              </label>
              <InputGroup className="max-w-40">
                <InputGroupInput
                  placeholder="Nhập vào"
                  type="number"
                  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                />
                <InputGroupAddon align={'inline-end'} className="border-l px-2">
                  gr
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn
                nhập sai kích thước)
              </label>
              <div className="flex gap-x-6">
                <InputGroup className="max-w-40">
                  <InputGroupInput
                    placeholder="R"
                    type="number"
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                  />
                  <InputGroupAddon
                    align={'inline-end'}
                    className="border-l px-2"
                  >
                    cm
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className="max-w-40">
                  <InputGroupInput
                    placeholder="D"
                    type="number"
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                  />
                  <InputGroupAddon
                    align={'inline-end'}
                    className="border-l px-2"
                  >
                    cm
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className="max-w-40">
                  <InputGroupInput
                    placeholder="C"
                    type="number"
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                  />
                  <InputGroupAddon
                    align={'inline-end'}
                    className="border-l px-2"
                  >
                    cm
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn
                nhập sai kích thước)
              </label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn đơn vị vận chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'GHTK'}>GHTK</SelectItem>
                    <SelectItem value={'GHN'}>GHN</SelectItem>
                    <SelectItem value={'NINJAVAN'}>NINJAVAN</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
          <div className="sticky bottom-0 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white flex justify-end gap-4 p-4">
            <Button
              variant={'outline'}
              type="submit"
              onClick={() => setValue('status', 'DRAFT')}
              className="cursor-pointer"
            >
              Lưu nháp
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setValue('status', 'PUBLISHED');
              }}
              className="cursor-pointer"
            >
              Gửi duyệt và bán
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
