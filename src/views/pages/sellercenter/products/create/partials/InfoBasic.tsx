import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
} from 'react-hook-form';
import { CategorySelector } from './category-ui';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ImagePlus } from 'lucide-react';
import { ChangeEvent, memo, RefObject } from 'react';

interface ICategory {
  id: string;
  name: string;
  children?: ICategory[];
}

interface InfoBasicProps {
  blockRefBasic: RefObject<HTMLDivElement | null>;
  control: any;
  errors: any;
  getValues: any;
  brandData: any[];
  categorys: any[];
  handleDeleteImage: (index: number) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InfoBasic = memo(function InfoBasic({
  blockRefBasic,
  getValues,
  control,
  errors,
  brandData,
  categorys,
  handleDeleteImage,
  handleImageChange,
}: InfoBasicProps) {
  const { t } = useTranslation();

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

  return (
    <div
      ref={blockRefBasic}
      className="bg-white p-2 h-auto rounded-lg space-y-6"
    >
      <div className="text-lg font-semibold">
        {t('sellercenter.products.create.basicInfo')}
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-medium">
          <span className="text-destructive">*</span>{' '}
          {t('sellercenter.products.create.productName')}
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="name"
              type="name"
              placeholder={t('sellercenter.products.create.productName')}
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {categorys && (
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
            <p className="text-red-500 text-sm">{errors.categories.message}</p>
          )}
        </div>
      )}
      <div className="grid gap-3">
        <Label htmlFor="brandId">{t('sellercenter.products.create.brand')}</Label>
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
                  <SelectValue
                    placeholder={t('sellercenter.products.create.brandPlaceholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {brandData &&
                      brandData.map((item: { id: number; name: string }) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
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
        <label className="text-sm font-medium">
          {t('sellercenter.products.create.slug')}
        </label>
        <Controller
          name="slugId"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="slugId"
              type="text"
              placeholder={t('sellercenter.products.create.slug')}
            />
          )}
        />
        {errors.slugId && (
          <p className="text-red-500 text-sm">{errors.slugId.message}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="brandId">{`${t('sellercenter.products.create.images')} (${getValues('images')?.length > 0 ? getValues('images').length : 0}/8)`}</Label>
        <div className="flex gap-x-2">
          {getValues('images') &&
            getValues('images').map((image: string, index: number) => (
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
  );
});

export default InfoBasic;
