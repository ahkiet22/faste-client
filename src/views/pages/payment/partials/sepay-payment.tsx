'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check } from 'lucide-react';
import { usePaymentState } from '@/hooks/use-payment-state';
import { validateAmount, validateBankDetails } from '@/lib/payment-validation';
import { ERROR_CODES } from '@/lib/error-handler';
import Image from 'next/image';

interface SepayPaymentProps {
  amount: number;
  description: string;
  disabled: boolean;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function SepayPayment({
  amount,
  description,
  disabled,
  onSuccess,
  onError,
}: SepayPaymentProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const paymentState = usePaymentState();

  const amountValidation = validateAmount(amount);
  const bankValidation = validateBankDetails('1234567890', 'Vietcombank');

  // Mock SEPAY data
  const sepayData = {
    accountNumber: '22012051822',
    bankName: 'MBBANK',
    amount: amount.toFixed(2),
    description: description,
    qrCode: `https://qr.sepay.vn/img?acc=22012051822&bank=MBBANK&amount=${amount.toFixed(0)}&des=${encodeURIComponent(description)}`,
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = async () => {
    // Validate amount
    if (!amountValidation.valid) {
      onError(ERROR_CODES.INVALID_AMOUNT);
      return;
    }

    // Validate bank details
    if (!bankValidation.valid) {
      onError(ERROR_CODES.INVALID_BANK_DETAILS);
      return;
    }

    paymentState.setProcessing();
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSuccess();
      paymentState.setSuccess();
    } catch (error) {
      const errorCode =
        error instanceof Error
          ? ERROR_CODES.TRANSACTION_FAILED
          : ERROR_CODES.UNKNOWN_ERROR;
      onError(errorCode);
      paymentState.setError(
        errorCode,
        'Failed to process SEPAY payment. Please try again.',
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Code Section */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Scan QR Code to Pay
        </p>
        <div className='w-56 h-56'>
          <Image
            width={100}
            height={100}
            src={sepayData.qrCode || '/placeholder.svg'}
            alt="SEPAY QR Code"
            className="w-full h-full rounded-lg border-2 border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Or enter details manually:
        </p>

        {/* Account Number */}
        <div>
          <Label
            htmlFor="account"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Account Number
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="account"
              value={sepayData.accountNumber}
              readOnly
              className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(sepayData.accountNumber, 'account')
              }
              disabled={disabled || paymentState.status === 'processing'}
              className="px-3"
            >
              {copiedField === 'account' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Bank Name */}
        <div>
          <Label
            htmlFor="bank"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Bank Name
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="bank"
              value={sepayData.bankName}
              readOnly
              className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(sepayData.bankName, 'bank')}
              disabled={disabled || paymentState.status === 'processing'}
              className="px-3"
            >
              {copiedField === 'bank' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <Label
            htmlFor="amount"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Amount (USD)
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="amount"
              value={sepayData.amount}
              readOnly
              className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(sepayData.amount, 'amount')}
              disabled={disabled || paymentState.status === 'processing'}
              className="px-3"
            >
              {copiedField === 'amount' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="description"
              value={sepayData.description}
              readOnly
              className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(sepayData.description, 'description')
              }
              disabled={disabled || paymentState.status === 'processing'}
              className="px-3"
            >
              {copiedField === 'description' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
          After completing the transfer, click the button below to confirm your
          payment.
        </AlertDescription>
      </Alert>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirmPayment}
        disabled={disabled || paymentState.status === 'processing'}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-auto"
        size="lg"
      >
        {paymentState.status === 'processing'
          ? 'Processing...'
          : 'Confirm Payment'}
      </Button>
    </div>
  );
}
