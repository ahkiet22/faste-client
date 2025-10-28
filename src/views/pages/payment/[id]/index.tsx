'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePaymentState } from '@/hooks/use-payment-state';
import { getErrorMessage, isRetryableError } from '@/lib/error-handler';
import { getDetailOrderTXById } from '@/services/order';
import CountdownTimer from '../partials/countdown-timer';
import SepayPayment from '../partials/sepay-payment';
import Web3Payment from '../partials/web3-payment';
import PayfastPayment from '../partials/payfast-payment';
import PaymentSummary from '../partials/payment-summary';
import { useRouter } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/router';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

type TProps = {
  id: number;
};

export default function PaymentPage({ id }: TProps) {
  const [timeExpired, setTimeExpired] = useState(false);
  const [transactionData, setTransactionData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const paymentState = usePaymentState();
  const router = useRouter();

  const handleTimeExpired = useCallback(() => {
    setTimeExpired(true);
    paymentState.setError(
      'PAYMENT_EXPIRED',
      'Payment time has expired. Please initiate a new payment.',
      false,
    );
  }, [paymentState]);

  const handlePaymentSuccess = useCallback(() => {
    paymentState.setSuccess();
  }, [paymentState]);

  const handlePaymentError = useCallback(
    (error: string) => {
      const isRetryable = isRetryableError(error);
      paymentState.setError(error, getErrorMessage(error), isRetryable);
    },
    [paymentState],
  );

  const handleRetry = useCallback(() => {
    if (paymentState.canRetry()) paymentState.clearError();
  }, [paymentState]);

  const handleStartNewPayment = useCallback(() => {
    paymentState.reset();
    setTimeExpired(false);
  }, [paymentState]);

  useEffect(() => {
    const fetchDetailOrder = async () => {
      setIsLoading(true);
      try {
        const res = await getDetailOrderTXById(id);
        if (res.statusCode !== 200) {
          throw new Error();
        }
        setTransactionData(res.data);
      } catch (error) {
        router.push(ROUTE_CONFIG.HOME);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetailOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Xác định component thanh toán hiển thị dựa trên transactionData.method
  const renderPaymentComponent = () => {
    if (!transactionData) return null;
    const commonProps = {
      amount: transactionData.total || 0,
      description: `DH${transactionData.id}`,
      disabled: timeExpired || paymentState.status === 'success',
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError,
    };

    switch (transactionData.method) {
      case 'SEPAY':
        return <SepayPayment {...commonProps} />;
      case 'WEB3':
        return <Web3Payment {...commonProps} />;
      case 'PayFast':
        return <PayfastPayment {...commonProps} />;
      default:
        return (
          <Alert className="bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700">
            <AlertDescription>
              ⚠️ Unsupported payment method: {transactionData.method}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      {isLoading && <LoadingDialog isLoading={true} />}
      {transactionData && (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Complete Your Payment
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Proceed with the payment method you selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Payment Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800 px-4 pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>
                        {transactionData.method}
                      </CardDescription>
                    </div>
                    <CountdownTimer onTimeExpired={handleTimeExpired} />
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Alerts */}
                  {timeExpired && (
                    <Alert className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                      <AlertDescription className="text-red-800 dark:text-red-200 flex items-center justify-between">
                        <span>
                          ⏰ Payment window has expired. Please start a new
                          payment.
                        </span>
                        <Button
                          onClick={handleStartNewPayment}
                          variant="outline"
                          size="sm"
                          className="ml-4 bg-transparent"
                        >
                          Start New Payment
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentState.status === 'success' && (
                    <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        ✓ Payment successful! Your order has been confirmed.
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentState.status === 'error' &&
                    paymentState.error &&
                    !timeExpired && (
                      <Alert className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold mb-1">
                                ✕ {paymentState.error.message}
                              </p>
                              <p className="text-sm opacity-90">
                                Error Code: {paymentState.error.code}
                              </p>
                              {paymentState.retryCount > 0 && (
                                <p className="text-sm opacity-90 mt-1">
                                  Attempt {paymentState.retryCount} of 3
                                </p>
                              )}
                            </div>
                            {paymentState.canRetry() && (
                              <Button
                                onClick={handleRetry}
                                variant="outline"
                                size="sm"
                                className="ml-4 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
                              >
                                Retry
                              </Button>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                  {/* Render payment form */}
                  {renderPaymentComponent()}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Summary */}
            <PaymentSummary
              transactionData={transactionData}
              paymentStatus={paymentState.status}
            />
          </div>
        </div>
      )}
    </main>
  );
}
