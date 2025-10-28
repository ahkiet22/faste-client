export const BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}`;

export const API_ENDPOINT = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
    AUTH_ME: `${BASE_URL}/auth/me`,
  },
  PROFILE: {
    INDEX: `${BASE_URL}/profile`,
  },
  ROLE: {
    INDEX: `${BASE_URL}/roles`,
  },
  USER: {
    INDEX: `${BASE_URL}/users`,
  },
  CART: {
    INDEX: `${BASE_URL}/cart`,
  },
  SETTING: {
    CITY: {
      INDEX: `${BASE_URL}/city`,
    },
    DELIVERY_TYPE: {
      INDEX: `${BASE_URL}/delivery-type`,
    },
    PAYMENT_TYPE: {
      INDEX: `${BASE_URL}/payment-type`,
    },
  },
  MANAGE_PRODUCT: {
    BRAND: {
      INDEX: `${BASE_URL}/brand`,
    },
    CATEGORY: {
      INDEX: `${BASE_URL}/category`,
    },
    PRODUCT: {
      INDEX: `${BASE_URL}/products`,
      PUBLIC: `${BASE_URL}/products/public`,
    },
    COMMENT: {
      INDEX: `${BASE_URL}/comments`,
    },
  },
  MANAGE_ORDER: {
    ORDER: {
      INDEX: `${BASE_URL}/order`,
    },
    REVIEW: {
      INDEX: `${BASE_URL}/reviews`,
    },
  },
  PAYMENT: {
    VN_PAY: {
      INDEX: `${BASE_URL}/payment/vnpay`,
    },
  },
  REPORT: {
    INDEX: `${BASE_URL}/report`,
  },
  NOTIFICATION: {
    INDEX: `${BASE_URL}/notifications`,
  },
};
