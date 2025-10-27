export class PaymentError extends Error {
  constructor(
    public code: string,
    public message: string,
    public retryable = true,
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',

  // Validation errors
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_BANK_DETAILS: 'INVALID_BANK_DETAILS',

  // Payment processing errors
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  PAYMENT_CANCELLED: 'PAYMENT_CANCELLED',

  // System errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]:
    'Network connection error. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.CONNECTION_FAILED]:
    'Failed to connect to payment service. Please try again.',
  [ERROR_CODES.INVALID_AMOUNT]:
    'Invalid payment amount. Please enter a valid amount.',
  [ERROR_CODES.INVALID_ADDRESS]:
    'Invalid wallet address. Please check and try again.',
  [ERROR_CODES.INVALID_BANK_DETAILS]:
    'Invalid bank details. Please verify your information.',
  [ERROR_CODES.INSUFFICIENT_BALANCE]:
    'Insufficient balance. Please top up your wallet.',
  [ERROR_CODES.TRANSACTION_FAILED]: 'Transaction failed. Please try again.',
  [ERROR_CODES.WALLET_NOT_CONNECTED]:
    'Wallet not connected. Please connect your wallet first.',
  [ERROR_CODES.PAYMENT_CANCELLED]: 'Payment was cancelled. Please try again.',
  [ERROR_CODES.UNKNOWN_ERROR]:
    'An unexpected error occurred. Please try again.',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}

export function isRetryableError(code: string): boolean {
  const nonRetryableCodes = [
    ERROR_CODES.INVALID_AMOUNT,
    ERROR_CODES.INVALID_ADDRESS,
    ERROR_CODES.INVALID_BANK_DETAILS,
    ERROR_CODES.INSUFFICIENT_BALANCE,
    ERROR_CODES.PAYMENT_CANCELLED,
  ];
  return !nonRetryableCodes.includes(code);
}
