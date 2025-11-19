'use client';

import TitleWidget from '@/components/widgets-template/title-widget';
import DiscountWidget from '@/components/widgets-template/discount-widget';
import BannerWidget from '@/components/widgets-template/banner-widget';
import CategoriesWidget from '@/components/widgets-template/categories-widget';
import ProductsWidget from '@/components/widgets-template/products-widget';
import StoriesWidget from '@/components/widgets-template/stories-widget';
import FlashSaleWidget from '@/components/widgets-template/flash-sale-widget';
import CollectionsWidget from '@/components/widgets-template/collections-widget';
import { Widget, WidgetType } from '@/types/widget';

interface WidgetRendererProps {
  widget: Widget;
  shopId?: number;
}

export default function WidgetRenderer({ widget, shopId }: WidgetRendererProps) {
  console.log("[WidgetRenderer] shopId", shopId)
  switch (widget.type) {
    case WidgetType.TITLE:
      return <TitleWidget widget={widget} />;
    case WidgetType.DISCOUNT:
      return <DiscountWidget widget={widget} />;
    case WidgetType.BANNER_CAROUSEL:
      return <BannerWidget widget={widget} />;
    case WidgetType.CATEGORIES_CAROUSEL:
      return <CategoriesWidget widget={widget} />;
    case WidgetType.PRODUCTS_ALL:
      return <ProductsWidget widget={widget} shopId={shopId ? shopId : null} />;
    case WidgetType.STORIES_CAROUSEL:
      return <StoriesWidget widget={widget} />;
    case WidgetType.FLASH_SALE:
      return <FlashSaleWidget widget={widget} />;
    case WidgetType.COLLECTIONS_VERTICAL:
      return <CollectionsWidget widget={widget} />;
    case WidgetType.PRODUCTS_RATING:
      return <div>PRODUCTS RATING</div>;
    case WidgetType.BANNER_GRID4:
      return <div>BANNER GRID</div>;
    case WidgetType.CATEGORIES_GRID:
      return <div>CATEGORIES GRID</div>;
    case WidgetType.COLLECTIONS_CAROUSEL:
      return <div>COLLECTIONS CAROUSEL</div>;
    case WidgetType.PRODUCTS_GRID:
      return <div>PRODUCTS GRID</div>;
    default:
      return null;
  }
}
