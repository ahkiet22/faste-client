export type ProductVariant = { value: string; options: string[] };

export type ProductSKU = {
  id: number;
  price: number;
  quantity: number;
  sold?: number;
  image?: string | null;
  attributes: Record<string, string>;
};

export type ProductCategory = {
  categoryId?: number;
  category?: { id?: number; name?: string };
};

export type ProductShop = {
  name: string;
  slug: string;
  logo?: string | null;
  addressShip?: {
    address?: string;
    divisionPath?: Record<string, string>;
  };
};

export type ProductDetail = {
  id: string | number;
  slugId: string;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  basePrice: number;
  price?: number;
  status?: string;
  rating?: number;
  totalViews?: number;
  ratingCount?: number;
  sold?: number;
  brand?: { name?: string } | string;
  categories?: ProductCategory[];
  variants?: ProductVariant[];
  skus?: ProductSKU[];
  shop?: ProductShop;
};

export type ProductReview = {
  id: number;
  skuId: number | null;
  rating: number;
  message?: string | null;
  images?: string[];
  isAnonymous?: boolean;
  createdAt: string | Date;
  createdBy?: { name?: string; avatar?: string | null };
};

export type ProductDetailPageData = {
  product: ProductDetail;
  relatedProducts: ProductDetail[];
  initialReviews: ProductReview[];
};
