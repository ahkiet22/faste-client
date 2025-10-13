import { ROUTE_CONFIG } from './router';

export interface IMenuItem {
  title: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
  items?: IMenuItem[];
}

export const USER_MENU_ITEMS: IMenuItem[] = [
  {
    title: 'Tài Khoản của tôi',
    icon: 'uil:user',
    isActive: true,
    items: [
      {
        title: 'Tài khoản',
        url: ROUTE_CONFIG.USER.INFO.ACCOUNT,
      },
      {
        title: 'Địa chỉ',
        url: ROUTE_CONFIG.USER.INFO.ADDRESS,
      },
      {
        title: 'Bảo mật',
        url: ROUTE_CONFIG.USER.INFO.SECURITYS,
      },
      {
        title: 'Đổi mật khẩu',
        url: ROUTE_CONFIG.USER.INFO.CHANGE_PASSWORD,
      },
      {
        title: 'Cài đặt thông báo',
        url: ROUTE_CONFIG.USER.INFO.NOTIFICATION,
      },
      {
        title: 'Cài đặt cá nhân',
        url: ROUTE_CONFIG.USER.INFO.SETTINGS,
      },
    ],
  },
  {
    title: 'Thông báo',
    url: ROUTE_CONFIG.USER.NOTIFICATION,
    icon: 'tdesign:notification',
  },
  {
    title: 'Đơn mua',
    url: ROUTE_CONFIG.USER.ORDER.ORDER_LIST,
    icon: 'lets-icons:order',
  },
  {
    title: 'Sản phẩm',
    icon: 'gridicons:product',
    items: [
      {
        title: 'Sản phẩm yêu thích',
        url: ROUTE_CONFIG.USER.PRODUCT.FAVORITE,
      },
      {
        title: 'Sản phẩm đã xem',
        url: ROUTE_CONFIG.USER.PRODUCT.RECENTLY_VIEWED,
      },
    ],
  },
  {
    title: 'Kho voucher',
    url: ROUTE_CONFIG.USER.VOUCHER_WALLET,
    icon: 'mdi:voucher-outline',
  },
  {
    title: 'Siêu sale tháng 11',
    url: ROUTE_CONFIG.USER.MARKETING.replace(':id', '11-11'),
    icon: 'mdi:sale-outline',
  },
];

export const SELLER_MENU_ITEMS: IMenuItem[] = [
  {
    title: 'Trang chủ',
    url: ROUTE_CONFIG.SELLER.DASHBOARD,
    icon: 'mdi:view-dashboard-outline',
    isActive: true,
  },
  {
    title: 'Thông báo',
    url: ROUTE_CONFIG.SELLER.NOTIFICATION,
    icon: 'tdesign:notification',
  },
  {
    title: 'Sản phẩm',
    icon: 'gridicons:product',
    items: [
      { title: 'Danh sách sản phẩm', url: ROUTE_CONFIG.SELLER.PRODUCT.LIST },
      { title: 'Thêm sản phẩm', url: ROUTE_CONFIG.SELLER.PRODUCT.CREATE },
      { title: 'Kho hàng', url: ROUTE_CONFIG.SELLER.PRODUCT.STOCK },
      { title: 'Quản lý hình ảnh', url: ROUTE_CONFIG.SELLER.PRODUCT.MEDIA },
      { title: 'Quản lý đánh giá', url: ROUTE_CONFIG.SELLER.PRODUCT.REVIEW },
    ],
  },
  {
    title: 'Đơn hàng',
    icon: 'lets-icons:order',
    items: [
      { title: 'Tất cả đơn hàng', url: ROUTE_CONFIG.SELLER.ORDER.LIST },
      { title: 'Đơn hủy / Trả hàng', url: ROUTE_CONFIG.SELLER.ORDER.RETURN },
      { title: 'Đánh giá từ khách', url: ROUTE_CONFIG.SELLER.ORDER.REVIEW },
    ],
  },
  {
    title: 'Gian hàng',
    icon: 'mdi:store-outline',
    items: [
      { title: 'Thiết kế gian hàng', url: ROUTE_CONFIG.SELLER.STORE.DESIGN },
      { title: 'Thông tin shop', url: ROUTE_CONFIG.SELLER.STORE.INFO },
    ],
  },
  {
    title: 'Flash Sale',
    icon: 'mdi:flash-outline',
    items: [
      {
        title: 'Tham gia Flash Sale toàn sàn',
        url: ROUTE_CONFIG.SELLER.FLASH_SALE.GLOBAL,
      },
      {
        title: 'Flash Sale của shop',
        url: ROUTE_CONFIG.SELLER.FLASH_SALE.SHOP,
      },
    ],
  },
  {
    title: 'Tài chính & Ví',
    icon: 'mdi:wallet-outline',
    items: [
      { title: 'Doanh thu', url: ROUTE_CONFIG.SELLER.WALLET.REVENUE },
      { title: 'Ví nội bộ', url: ROUTE_CONFIG.SELLER.WALLET.INTERNAL },
      { title: 'Ví blockchain', url: ROUTE_CONFIG.SELLER.WALLET.BLOCKCHAIN },
    ],
  },
  {
    title: 'Kho voucher',
    icon: 'mdi:voucher-outline',
    items: [
      { title: 'Danh sách voucher', url: ROUTE_CONFIG.SELLER.VOUCHER.LIST },
      { title: 'Tạo voucher mới', url: ROUTE_CONFIG.SELLER.VOUCHER.CREATE },
      { title: 'Thống kê & báo cáo', url: ROUTE_CONFIG.SELLER.VOUCHER.STATS },
    ],
  },
  {
    title: 'Marketing',
    icon: 'solar:sale-outline',
    items: [
      {
        title: 'Chiến dịch marketing',
        url: ROUTE_CONFIG.SELLER.MARKETING.CAMPAIGN,
      },
      { title: 'Quản lý quảng cáo', url: ROUTE_CONFIG.SELLER.MARKETING.ADS },
    ],
  },
  {
    title: 'Trung tâm dịch vụ',
    icon: 'mdi:headset',
    items: [
      {
        title: 'Khiếu nại / Tranh chấp',
        url: ROUTE_CONFIG.SELLER.SERVICE_CENTER.COMPLAINTS,
      },
      {
        title: 'Yêu cầu trả hàng / Hoàn tiền',
        url: ROUTE_CONFIG.SELLER.SERVICE_CENTER.RETURNS,
      },
      {
        title: 'Hỗ trợ khách hàng',
        url: ROUTE_CONFIG.SELLER.SERVICE_CENTER.SUPPORT,
      },
    ],
  },
  {
    title: 'Cài đặt',
    icon: 'uil:user',
    items: [
      { title: 'Thông tin cá nhân', url: ROUTE_CONFIG.SELLER.ACCOUNT },
      { title: 'Địa chỉ', url: ROUTE_CONFIG.SELLER.ADDRESS },
      { title: 'Đổi mật khẩu', url: ROUTE_CONFIG.SELLER.CHANGE_PASSWORD },
      { title: 'Cài đặt cá nhân', url: ROUTE_CONFIG.SELLER.SETTINGS },
    ],
  },
];
