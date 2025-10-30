export const ROUTE_CONFIG = {
  USER: {
    INFO: {
      ACCOUNT: '/user/account',
      CHANGE_PASSWORD: '/user/change-password',
      ADDRESS: '/user/address',
      SETTINGS: '/user/settings',
      SECURITYS: '/user/securitys',
      NOTIFICATION: '/user/notification',
    },
    NOTIFICATION: '/user/notification',
    PRODUCT: {
      FAVORITE: '/user/favorite',
      RECENTLY_VIEWED: '/user/recently-viewed',
    },
    REVIEW_HUB: '/user/review-hub',
    ORDER: {
      ORDER_LIST: '/user/order',
    },
    WALLET: {
      E_WALLER: '/e-wallet',
      CRYPTO_WALLER: '/crypto-wallet',
    },
    VOUCHER_WALLET: '/user/voucher-wallet',
    MARKETING: '/m/:id',
  },

  // Seller dashboard
  SELLER: {
    DASHBOARD: '/sellercenter/dashboard',
    NOTIFICATION: '/sellercenter/notification',

    PRODUCT: {
      LIST: '/sellercenter/products/list',
      CREATE: '/sellercenter/products/create',
      STOCK: '/sellercenter/products/stock',
      MEDIA: '/sellercenter/products/media',
      REVIEW: '/sellercenter/products/reviews',
    },

    ORDER: {
      LIST: '/sellercenter/orders',
      RETURN: '/sellercenter/orders/returns',
      REVIEW: '/sellercenter/orders/reviews',
    },

    STORE: {
      DESIGN: '/sellercenter/seller-store/template',
      INFO: '/sellercenter/seller-store/info',
    },

    FLASH_SALE: {
      GLOBAL: '/sellercenter/flash-sale/global',
      SHOP: '/sellercenter/flash-sale/shop',
    },

    WALLET: {
      REVENUE: '/sellercenter/wallet/revenue',
      INTERNAL: '/sellercenter/wallet/internal',
      BLOCKCHAIN: '/sellercenter/wallet/blockchain',
    },

    VOUCHER: {
      LIST: '/sellercenter/vouchers',
      CREATE: '/sellercenter/vouchers/create',
      STATS: '/sellercenter/vouchers/stats',
    },

    MARKETING: {
      CAMPAIGN: '/sellercenter/marketing/campaigns',
      ADS: '/sellercenter/marketing/ads',
    },

    SERVICE_CENTER: {
      COMPLAINTS: '/sellercenter/service-center/complaints',
      RETURNS: '/sellercenter/service-center/returns',
      SUPPORT: '/sellercenter/service-center/support',
    },

    ACCOUNT: '/sellercenter/account',
    ADDRESS: '/sellercenter/address',
    CHANGE_PASSWORD: '/sellercenter/change-password',
    SETTINGS: '/sellercenter/settings',
  },

  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  HOME: '/',
  PRODUCT: {
    INDEX: '/products',
    DETAIL: '/p/:slug.:id',
    CATEGORY: '/c/:slug.:id',
    SEARCH: '/search',
    BRAND: '/b/:slug.:id',
    FLASH_SALE: '/flash-sale',
  },
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  SHOP: '/shop',
};
