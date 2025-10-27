'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Wallet } from 'lucide-react';
import { usePaymentState } from '@/hooks/use-payment-state';
import {
  validateAmount,
  validateWalletAddress,
} from '@/lib/payment-validation';
import { ERROR_CODES } from '@/lib/error-handler';

interface Web3PaymentProps {
  amount: number;
  disabled: boolean;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function Web3Payment({
  amount,
  disabled,
  onSuccess,
  onError,
}: Web3PaymentProps) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const paymentState = usePaymentState();

  const amountValidation = validateAmount(amount);

  const handleConnectWallet = async () => {
    paymentState.setProcessing();
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Mock wallet address
      const mockAddress =
        '0x' +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('');

      const validation = validateWalletAddress(mockAddress);
      if (!validation.valid) {
        onError(ERROR_CODES.INVALID_ADDRESS);
        paymentState.setError(
          ERROR_CODES.INVALID_ADDRESS,
          'Invalid wallet address generated',
        );
        return;
      }

      setWalletAddress(mockAddress);
      setWalletConnected(true);
      paymentState.setSuccess();
    } catch (error) {
      const errorCode = ERROR_CODES.CONNECTION_FAILED;
      onError(errorCode);
      paymentState.setError(
        errorCode,
        'Failed to connect wallet. Please try again.',
      );
    }
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    paymentState.reset();
  };

  const handleConfirmTransaction = async () => {
    if (!amountValidation.valid) {
      onError(ERROR_CODES.INVALID_AMOUNT);
      return;
    }

    paymentState.setProcessing();
    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSuccess();
      paymentState.setSuccess();
    } catch (error) {
      const errorCode = ERROR_CODES.TRANSACTION_FAILED;
      onError(errorCode);
      paymentState.setError(errorCode, 'Transaction failed. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!walletConnected ? (
        <>
          {/* Connect Wallet Section */}
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border border-purple-200 dark:border-purple-800">
            <Wallet className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
            <p className="text-center text-slate-700 dark:text-slate-300 mb-6">
              Connect your Web3 wallet to proceed with the payment
            </p>
            <Button
              onClick={handleConnectWallet}
              disabled={disabled || paymentState.status === 'processing'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-2 h-auto"
              size="lg"
            >
              {paymentState.status === 'processing'
                ? 'Connecting...'
                : 'Connect Wallet'}
            </Button>
          </div>

          {/* Info Alert */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
              Supported wallets: MetaMask, WalletConnect, Coinbase Wallet
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <>
          {/* Connected Wallet Info */}
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                ✓ Wallet Connected
              </p>
              <div className="flex gap-2 items-center">
                <Input
                  value={walletAddress}
                  readOnly
                  className="bg-white dark:bg-slate-900 border-green-300 dark:border-green-700 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(walletAddress)}
                  className="px-3"
                >
                  {copiedAddress ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Amount to Send:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {amount} ETH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Network:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Ethereum Mainnet
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Gas Fee (est.):
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  0.005 ETH
                </span>
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                Review the transaction details in your wallet before confirming.
              </AlertDescription>
            </Alert>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleConfirmTransaction}
              disabled={disabled || paymentState.status === 'processing'}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-auto"
              size="lg"
            >
              {paymentState.status === 'processing'
                ? 'Processing...'
                : 'Confirm Transaction'}
            </Button>
            <Button
              onClick={handleDisconnectWallet}
              disabled={disabled || paymentState.status === 'processing'}
              variant="outline"
              className="flex-1 bg-transparent"
              size="lg"
            >
              Disconnect
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
