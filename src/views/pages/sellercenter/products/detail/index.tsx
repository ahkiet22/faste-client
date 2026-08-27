'use client';

// -- React --
import { useCallback, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

// -- Component UI --
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// -- React Query & Services --
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/product.service';

// -- Icon & Helpers --
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { ProductFormSidebar } from '@/views/pages/sellercenter/products/create/partials/product-form-sidebar';
import { ROUTE_CONFIG } from '@/configs/router';

export const ProductDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // -- Refs scroll cho sidebar --
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

  // -- Fetch Chi tiết Sản phẩm --
  const { data: product, isLoading } = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
    select: (res) => res?.data,
  });

  if (isLoading) {
    return <LoadingDialog isLoading />;
  }

  if (!product) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Không tìm thấy thông tin sản phẩm</p>
        <Button
          className="mt-4 cursor-pointer"
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const mainImage = selectedImage || product.images?.[0] || '/placeholder.svg';

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-border">
        <div className="flex items-center gap-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <Icon icon="material-symbols:arrow-back" width={20} height={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xs text-muted-foreground">ID: {productId}</p>
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <Badge
            variant={product.status === 'PUBLISHED' ? 'default' : 'secondary'}
            className={
              product.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
            }
          >
            {product.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
          </Badge>

          <Button
            className="cursor-pointer flex items-center gap-x-1.5"
            onClick={() => router.push(`${ROUTE_CONFIG.SELLER.PRODUCT.EDIT}/${productId}`)}
          >
            <Icon icon="iconamoon:edit-duotone" width={18} height={18} />
            Chỉnh sửa sản phẩm
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-x-4">
        {/* Main View Section */}
        <div className="w-3/4 flex flex-col gap-y-4">
          {/* Thông tin cơ bản */}
          <Card ref={blockRefs.basic}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Tên sản phẩm
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Slug ID
                  </label>
                  <p className="text-sm font-mono text-gray-700 bg-gray-50 p-1.5 rounded w-fit">
                    {product.slugId || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Danh mục
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((cat: any, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {cat.category?.name || `Category #${cat.categoryId || cat.id}`}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Chưa chọn</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Thương hiệu
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {product.brand?.name || (product.brandId ? `Brand ID: ${product.brandId}` : 'Không có')}
                  </p>
                </div>
              </div>

              {/* Gallery ảnh */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">
                  Hình ảnh sản phẩm ({product.images?.length || 0})
                </label>
                <div className="flex gap-4">
                  <div className="w-32 h-32 relative border rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={mainImage}
                      alt="Main product image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.images?.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 relative border rounded-md overflow-hidden cursor-pointer transition-all ${
                          mainImage === img ? 'ring-2 ring-blue-500 border-transparent' : 'hover:opacity-80'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Đặc tính sản phẩm */}
          <Card ref={blockRefs.characteristics}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Đặc tính sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 italic">
                {product.characteristics || 'Chưa thiết lập đặc tính sản phẩm'}
              </p>
            </CardContent>
          </Card>

          {/* Giá bán, Kho hàng & SKU */}
          <Card ref={blockRefs.pricing}>
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {t('sellercenter.products.create.pricingAndStock')}
              </CardTitle>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">
                  Giá gốc ban đầu
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {Number(product.basePrice || 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Danh sách biến thể */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">
                    Thuộc tính biến thể
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {product.variants.map((v: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg bg-gray-50/50 space-y-1"
                      >
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {v.value}
                        </span>
                        {/* <div className="flex flex-wrap gap-1 mt-1">
                          {v.options?.map((opt: string, optIdx: number) => (
                            <Badge key={optIdx} variant="secondary">
                              {opt}
                            </Badge>
                          ))}
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-3">
                  Danh sách mã SKU ({product.skus?.length || 0})
                </h4>
                {product.skus && product.skus.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Mã SKU</TableHead>
                          <TableHead>Phân loại / Thuộc tính</TableHead>
                          <TableHead className="text-right">Giá bán</TableHead>
                          <TableHead className="text-right">Tồn kho</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.skus.map((sku: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs font-semibold">
                              {sku.skuCode}
                            </TableCell>
                            <TableCell className="text-xs">
                              {sku.attributes
                                ? Object.entries(sku.attributes)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' | ')
                                : 'Mặc định'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-600">
                              {Number(sku.price || 0).toLocaleString('vi-VN')} đ
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {sku.quantity ?? 0}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có dữ liệu SKU</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mô tả sản phẩm */}
          <Card ref={blockRefs.description}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div
                className="prose max-w-none text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: product.description || '<p>Chưa có mô tả</p>',
                }}
              />
            </CardContent>
          </Card>

          {/* Vận chuyển & Bảo hành */}
          <Card ref={blockRefs.shipping}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Vận chuyển & Bảo hành</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <span className="text-xs text-muted-foreground block">
                  Cân nặng (sau đóng gói)
                </span>
                <span className="text-sm font-semibold">
                  {product.weight ? `${product.weight} kg` : 'Chưa nhập'}
                </span>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-xs text-muted-foreground block">
                  Kích thước (D x R x C)
                </span>
                <span className="text-sm font-semibold">
                  {product.length && product.width && product.height
                    ? `${product.length} x ${product.width} x ${product.height} cm`
                    : 'Chưa nhập'}
                </span>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-xs text-muted-foreground block">
                  Chế độ bảo hành
                </span>
                <span className="text-sm font-semibold">
                  {product.warrantyPolicy || 'Không bảo hành'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Sidebar Navigation & Mobile Preview */}
        <div className="w-1/4 relative">
          <div className="sticky top-4">
            <ProductFormSidebar scrollToBlock={scrollToBlock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;