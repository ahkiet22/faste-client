import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '@/hooks/use-payment-state';

interface PaymentSummaryProps {
  orderData: {
    orderId: string;
    total: number;
    currency: string;
    description: string;
  };
  paymentStatus?: PaymentStatus;
}

export default function PaymentSummary({
  orderData,
  paymentStatus = 'idle',
}: PaymentSummaryProps) {
  const getStatusBadge = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">Processing</Badge>
        );
      case 'error':
        return <Badge className="bg-red-600 hover:bg-red-700">Failed</Badge>;
      default:
        return (
          <Badge className="bg-slate-600 hover:bg-slate-700">Pending</Badge>
        );
    }
  };

  return (
    <Card className="border-0 shadow-lg sticky top-8">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order Summary</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Order ID */}
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Order ID
            </p>
            <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
              {orderData.orderId}
            </p>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Description */}
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Description
            </p>
            <p className="text-sm text-slate-900 dark:text-white">
              {orderData.description}
            </p>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Total Amount */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Total Amount
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {orderData.currency} {orderData.total.toFixed(2)}
            </p>
          </div>

          {/* Payment Status */}
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Status:{' '}
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
