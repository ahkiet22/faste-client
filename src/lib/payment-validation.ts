export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAmount(amount: number): ValidationResult {
  const errors: string[] = [];

  if (amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!Number.isFinite(amount)) {
    errors.push('Amount must be a valid number');
  }

  if (amount > 1000000) {
    errors.push('Amount exceeds maximum limit of $1,000,000');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateWalletAddress(address: string): ValidationResult {
  const errors: string[] = [];

  if (!address) {
    errors.push('Wallet address is required');
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    errors.push('Invalid wallet address format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateBankDetails(
  accountNumber: string,
  bankName: string,
): ValidationResult {
  const errors: string[] = [];

  if (!accountNumber || accountNumber.trim().length === 0) {
    errors.push('Account number is required');
  }

  if (!bankName || bankName.trim().length === 0) {
    errors.push('Bank name is required');
  }

  if (accountNumber && accountNumber.length < 8) {
    errors.push('Account number must be at least 8 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
