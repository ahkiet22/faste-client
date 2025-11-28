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
    title: 'Ví',
    icon: 'iconoir:wallet',
    items: [
      {
        title: 'E-Wallet',
        url: ROUTE_CONFIG.USER.WALLET.E_WALLER,
      },
      {
        title: 'Crypto Wallet',
        url: ROUTE_CONFIG.USER.WALLET.CRYPTO_WALLER,
      },
    ],
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
    title: 'Chat',
    url: ROUTE_CONFIG.SELLER.CHAT,
    icon: 'ri:chat-ai-line',
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

export const ADMIN_MENU_ITEMS: IMenuItem[] = [
  {
    title: 'Dashboard',
    url: ROUTE_CONFIG.ADMIN.DASHBOARD,
    icon: 'mdi:view-dashboard-outline',
    isActive: true,
  },
  {
    title: 'Quản lý người dùng',
    icon: 'ph:users-three',
    items: [
      { title: 'Danh sách người dùng', url: ROUTE_CONFIG.ADMIN.USER.LIST },
      { title: 'Danh sách người bán', url: ROUTE_CONFIG.ADMIN.USER.SELLERS },
      { title: 'Quản trị viên', url: ROUTE_CONFIG.ADMIN.USER.ADMINS },
      {
        title: 'Yêu cầu duyệt Shop',
        url: ROUTE_CONFIG.ADMIN.USER.SHOP_REQUESTS,
      },
    ],
  },
  {
    title: 'Quản lý sản phẩm',
    icon: 'gridicons:product',
    items: [
      { title: 'Tất cả sản phẩm', url: ROUTE_CONFIG.ADMIN.PRODUCT.LIST },
      { title: 'Duyệt sản phẩm', url: ROUTE_CONFIG.ADMIN.PRODUCT.APPROVAL },
      { title: 'Danh mục ngành hàng', url: ROUTE_CONFIG.ADMIN.CATEGORY.LIST },
      { title: 'Thương hiệu', url: ROUTE_CONFIG.ADMIN.BRAND.LIST },
      { title: 'Thuộc tính', url: ROUTE_CONFIG.ADMIN.ATTRIBUTE.LIST },
    ],
  },
  {
    title: 'Đơn hàng & Vận chuyển',
    icon: 'lets-icons:order',
    items: [
      { title: 'Tất cả đơn hàng', url: ROUTE_CONFIG.ADMIN.ORDER.LIST },
      {
        title: 'Tranh chấp / Khiếu nại',
        url: ROUTE_CONFIG.ADMIN.ORDER.DISPUTE,
      },
      {
        title: 'Cài đặt vận chuyển',
        url: ROUTE_CONFIG.ADMIN.SHIPPING.SETTINGS,
      },
    ],
  },
  {
    title: 'Tài chính',
    icon: 'mdi:finance',
    items: [
      {
        title: 'Tổng quan tài chính',
        url: ROUTE_CONFIG.ADMIN.FINANCE.OVERVIEW,
      },
      { title: 'Doanh thu sàn', url: ROUTE_CONFIG.ADMIN.FINANCE.REVENUE },
      { title: 'Yêu cầu rút tiền', url: ROUTE_CONFIG.ADMIN.FINANCE.PAYOUTS },
      { title: 'Đối soát', url: ROUTE_CONFIG.ADMIN.FINANCE.RECONCILIATION },
    ],
  },
  {
    title: 'Marketing & Banner',
    icon: 'solar:sale-outline',
    items: [
      { title: 'Chiến dịch sàn', url: ROUTE_CONFIG.ADMIN.MARKETING.CAMPAIGN },
      { title: 'Voucher sàn', url: ROUTE_CONFIG.ADMIN.MARKETING.VOUCHER },
      { title: 'Flash Sale', url: ROUTE_CONFIG.ADMIN.MARKETING.FLASH_SALE },
      { title: 'Quản lý Banner', url: ROUTE_CONFIG.ADMIN.CONTENT.BANNER },
    ],
  },
  {
    title: 'Nội dung & Thông báo',
    icon: 'fluent:content-settings-20-regular',
    items: [
      { title: 'Bài viết / Blog', url: ROUTE_CONFIG.ADMIN.CONTENT.BLOG },
      { title: 'Gửi thông báo', url: ROUTE_CONFIG.ADMIN.NOTIFICATION.SEND },
      { title: 'Trang tĩnh (Pages)', url: ROUTE_CONFIG.ADMIN.CONTENT.PAGES },
    ],
  },
  {
    title: 'Hệ thống',
    icon: 'uil:setting',
    items: [
      { title: 'Cấu hình chung', url: ROUTE_CONFIG.ADMIN.SETTINGS.GENERAL },
      { title: 'Phân quyền (Roles)', url: ROUTE_CONFIG.ADMIN.SETTINGS.ROLES },
      {
        title: 'Phương thức thanh toán',
        url: ROUTE_CONFIG.ADMIN.SETTINGS.PAYMENT,
      },
      { title: 'Nhật ký hoạt động', url: ROUTE_CONFIG.ADMIN.SETTINGS.LOGS },
    ],
  },
];
