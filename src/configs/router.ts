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
      CRYPTO_WALLER: '/user/crypto-wallet',
    },
    VOUCHER_WALLET: '/user/voucher-wallet',
    MARKETING: '/m/:id',
  },

  // Seller dashboard
  SELLER: {
    DASHBOARD: '/sellercenter/dashboard',
    CHAT: '/sellercenter/chat',
    NOTIFICATION: '/sellercenter/notification',

    PRODUCT: {
      LIST: '/sellercenter/products/list',
      CREATE: '/sellercenter/products/create',
      STOCK: '/sellercenter/products/stock',
      MEDIA: '/sellercenter/products/media',
      REVIEW: '/sellercenter/products/reviews',
    },

    ORDER: {
      LIST: '/sellercenter/orders/list',
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
      LIST: '/sellercenter/vouchers/list',
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

  // Admin dashboard
  ADMIN: {
    DASHBOARD: '/admin/dashboard',

    USER: {
      LIST: '/admin/users/list',
      SELLERS: '/admin/users/sellers',
      ADMINS: '/admin/users/admins',
      SHOP_REQUESTS: '/admin/users/shop-requests',
    },

    PRODUCT: {
      LIST: '/admin/products/list',
      APPROVAL: '/admin/products/approval',
    },

    CATEGORY: {
      LIST: '/admin/categories',
    },

    BRAND: {
      LIST: '/admin/brands',
    },

    ATTRIBUTE: {
      LIST: '/admin/attributes',
    },

    ORDER: {
      LIST: '/admin/orders/list',
      DISPUTE: '/admin/orders/disputes',
    },

    SHIPPING: {
      SETTINGS: '/admin/shipping/settings',
    },

    FINANCE: {
      OVERVIEW: '/admin/finance/overview',
      REVENUE: '/admin/finance/revenue',
      PAYOUTS: '/admin/finance/payouts',
      RECONCILIATION: '/admin/finance/reconciliation',
    },

    MARKETING: {
      CAMPAIGN: '/admin/marketing/campaigns',
      VOUCHER: '/admin/marketing/vouchers',
      FLASH_SALE: '/admin/marketing/flash-sale',
    },

    CONTENT: {
      BANNER: '/admin/content/banners',
      BLOG: '/admin/content/blog',
      PAGES: '/admin/content/pages',
    },

    NOTIFICATION: {
      SEND: '/admin/notifications/send',
    },

    SETTINGS: {
      GENERAL: '/admin/settings/general',
      ROLES: '/admin/settings/roles',
      PAYMENT: '/admin/settings/payment',
      LOGS: '/admin/settings/logs',
    },
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
