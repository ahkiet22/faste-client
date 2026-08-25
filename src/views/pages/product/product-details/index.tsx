import ProductDescription from './ProductDescription';
import ProductPurchaseClient from './ProductPurchaseClient';
import ProductReviewsDeferred from './ProductReviewsDeferred';
import { getLocalizedPath, getSiteUrl } from '@/lib/seo';
import { normalizeProductImages } from './product-detail.helpers';
import type {
  ProductDetailPageData,
  ProductReview,
} from './product-detail.types';
import { ProductRelated } from './partials/ProductRelated';
import { ProductSpecs } from './partials/ProductSpecs';
import { ShopInfo } from './partials/ShopInfo';

type Props = ProductDetailPageData & { locale: string };

export default function ProductDetails({
  product,
  relatedProducts,
  initialReviews,
  locale,
}: Props) {
  const skus = product.skus ?? [];
  const images = normalizeProductImages(product.images ?? [], skus);
  const totalSold = skus.reduce((total, sku) => total + (sku.sold ?? 0), 0);
  const canonicalUrl = new URL(
    getLocalizedPath(locale, `/product/${product.slugId}`),
    getSiteUrl(),
  ).toString();

  return (
    <div className="flex flex-col gap-y-4">
      <ProductPurchaseClient
        images={images}
        product={{
          name: product.name,
          basePrice: product.basePrice,
          rating: product.rating,
          ratingCount: product.ratingCount,
          totalViews: product.totalViews,
          sold: product.sold,
          variants: product.variants ?? [],

          skus,
        }}
      />
      {product.shop ? <ShopInfo shop={product.shop} /> : null}
      <ProductSpecs product={product} totalSold={totalSold} />
      <ProductDescription
        description={product.description}
        canonicalUrl={canonicalUrl}
      />
      <ProductReviewsDeferred
        productId={Number(product.id)}
        rating={product.rating ?? 0}
        skus={skus}
        initialReviews={initialReviews as ProductReview[]}
      />
      <ProductRelated products={relatedProducts} />
    </div>
  );
}
