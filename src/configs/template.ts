import { WidgetType } from '@/types/widget';

export const widgetIconLabel: Record<
  WidgetType,
  { label: string; icon: string }
> = {
  TITLE: {
    label: 'Tiêu đề',
    icon: 'material-symbols:title',
  },
  DISCOUNT: {
    label: 'Mã giảm giá',
    icon: 'streamline:discount-percent-coupon',
  },
  BANNER_CAROUSEL: {
    label: 'Banner',
    icon: 'ph:slideshow',
  },
  CATEGORIES_CAROUSEL: {
    label: 'Danh mục',
    icon: 'material-symbols:category',
  },
  PRODUCTS_ALL: {
    label: 'Widget sản phẩm',
    icon: 'streamline-cyber:shopping-product',
  },
  STORIES_CAROUSEL: {
    label: 'Bảng tin',
    icon: 'streamline-sharp:story-post',
  },
  FLASH_SALE: {
    label: 'Flash Sale',
    icon: 'typcn:flash-outline',
  },
  COLLECTIONS_VERTICAL: {
    label: 'Bộ sưu tập',
    icon: 'material-symbols:collections-bookmark',
  },

  // Các type mới — bắt buộc phải thêm
  BANNER_GRID4: {
    label: 'Banner dạng lưới 4',
    icon: 'ph:grid-four',
  },
  CATEGORIES_GRID: {
    label: 'Danh mục dạng lưới',
    icon: 'material-symbols:grid-view',
  },
  PRODUCTS_RATING: {
    label: 'Sản phẩm đánh giá',
    icon: 'material-symbols:star-rate',
  },
  PRODUCTS_GRID: {
    label: 'Sản phẩm dạng lưới',
    icon: 'material-symbols:apps',
  },
  COLLECTIONS_CAROUSEL: {
    label: 'Bộ sưu tập xoay',
    icon: 'ph:circles-four',
  },
};
