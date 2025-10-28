'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePaymentState } from '@/hooks/use-payment-state';
import { getErrorMessage, isRetryableError } from '@/lib/error-handler';
import SepayPayment from './partials/sepay-payment';
import Web3Payment from './partials/web3-payment';
import PayfastPayment from './partials/payfast-payment';
import PaymentSummary from './partials/payment-summary';
import CountdownTimer from './partials/countdown-timer';
import { getDetailOrderTXById } from '@/services/order';

type PaymentMethod = 'SEPAY' | 'WEB3' | 'PayFast';

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('SEPAY');
  const [timeExpired, setTimeExpired] = useState(false);
  const paymentState = usePaymentState();

  const orderData = {
    orderId: 'ORD-2024-001234',
    total: 150.0,
    currency: 'USD',
    description: 'DH1',
  };

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
    if (paymentState.canRetry()) {
      paymentState.clearError();
    }
  }, [paymentState]);

  const handleStartNewPayment = useCallback(() => {
    paymentState.reset();
    setTimeExpired(false);
  }, [paymentState]);

  useEffect(() => {
    const fetchDetailOrder = async () => {
      try {
        const res = await getDetailOrderTXById(3)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    } 
    fetchDetailOrder()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Complete Your Payment
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select your preferred payment method to proceed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Payment Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800 px-4 pb-2!">
                <div className='flex justify-between items-center'>
                  <div>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Choose how you&apos;d like to pay
                    </CardDescription>
                  </div>
                  <CountdownTimer onTimeExpired={handleTimeExpired} />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Time Expired Alert */}
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

                {/* Payment Success Alert */}
                {paymentState.status === 'success' && (
                  <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      ✓ Payment successful! Your order has been confirmed.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Payment Error Alert with Retry Option */}
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

                {/* Payment Method Tabs */}
                <Tabs
                  value={selectedMethod}
                  onValueChange={(value) =>
                    setSelectedMethod(value as PaymentMethod)
                  }
                  aria-disabled={timeExpired || paymentState.status === 'success'}
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger
                      value="SEPAY"
                      disabled={
                        timeExpired || paymentState.status === 'success'
                      }
                    >
                      SEPAY
                    </TabsTrigger>
                    <TabsTrigger
                      value="WEB3"
                      disabled={
                        timeExpired || paymentState.status === 'success'
                      }
                    >
                      WEB3
                    </TabsTrigger>
                    <TabsTrigger
                      value="PayFast"
                      disabled={
                        timeExpired || paymentState.status === 'success'
                      }
                    >
                      PayFast
                    </TabsTrigger>
                  </TabsList>

                  {/* SEPAY Tab */}
                  <TabsContent value="SEPAY">
                    <SepayPayment
                      amount={orderData.total}
                      description={orderData.description}
                      disabled={
                        timeExpired || paymentState.status === 'success'
                      }
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </TabsContent>

                  {/* WEB3 Tab */}
                  <TabsContent value="WEB3">
                    <Web3Payment
                      amount={orderData.total}
                      disabled={
                        timeExpired || paymentState.status === 'success'
                      }
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </TabsContent>

                  {/* PayFast Tab */}
                  <TabsContent value="PayFast">
                    <PayfastPayment
                      amount={orderData.total}
                      disabled={
                        timeExpired || paymentState.status === 'success'
                      }
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary and Timer */}
          {/* Payment Summary */}
          <PaymentSummary
            orderData={orderData}
            paymentStatus={paymentState.status}
          />

          {/* Countdown Timer */}
        </div>
      </div>
    </main>
  );
}
