import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  iconsStatusOrder,
  statusToColor,
  statusToLabel,
} from '@/configs/order';
import { formatCurrency } from '@/helpers/currency';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/types/order';
import { Dispatch, memo, SetStateAction } from 'react';

interface TProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedOrder: any;
  handleCloseModal: () => void;
}

const DetailOrderModel = memo(function DetailOrderModel({
  isModalOpen,
  selectedOrder,
  setIsModalOpen,
  handleCloseModal,
}: TProps) {
  const handleActionClick = (action: string) => {
    alert(`Thực hiện hành động: ${action} cho đơn hàng #${selectedOrder?.id}`);
  };
  const getActionButtons = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return (
          <>
            <Button
              onClick={() => handleActionClick('Xác nhận đơn hàng')}
              size="sm"
            >
              Xác nhận đơn hàng
            </Button>
            <Button
              onClick={() => handleActionClick('Hủy đơn')}
              variant="outline"
              size="sm"
            >
              Hủy đơn
            </Button>
          </>
        );
      case 'PENDING_PAYMENT':
        return (
          <Button
            onClick={() => handleActionClick('Gửi nhắc thanh toán')}
            size="sm"
          >
            Gửi nhắc thanh toán
          </Button>
        );
      case 'PROCESSING':
        return (
          <Button
            onClick={() => handleActionClick('Chuẩn bị giao hàng')}
            size="sm"
          >
            Chuẩn bị giao hàng
          </Button>
        );
      case 'PENDING_PICKUP':
        return (
          <Button
            onClick={() => handleActionClick('Xác nhận đã lấy hàng')}
            size="sm"
          >
            Xác nhận đã lấy hàng
          </Button>
        );
      case 'PENDING_DELIVERY':
        return (
          <Button
            onClick={() => handleActionClick('Xem vận đơn')}
            variant="outline"
            size="sm"
          >
            Xem vận đơn
          </Button>
        );
      case 'DELIVERED':
        return (
          <Button
            onClick={() => handleActionClick('In hóa đơn')}
            variant="outline"
            size="sm"
          >
            In hóa đơn
          </Button>
        );
      default:
        return null;
    }
  };

  console.log(
    'RENDER MODEL',
    isModalOpen,
    selectedOrder,
    setIsModalOpen,
    handleCloseModal,
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết đơn hàng #{selectedOrder?.id}
          </DialogTitle>
        </AlertDialogHeader>

        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge
                      variant="outline"
                      className={statusToColor(selectedOrder.status)}
                    >
                      {statusToLabel(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-medium">
                      {dayjs(selectedOrder.createdAt).format(
                        'DD/MM/YYYY HH:mm',
                      )}
                    </span>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cập nhật:</span>
                      <span className="font-medium">
                        {dayjs(selectedOrder.updatedAt).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Thông tin thanh toán
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-medium">
                      {selectedOrder.Payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(selectedOrder.Payment.amount)}
                    </span>
                  </div>
                  {selectedOrder.Payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đã thanh toán:</span>
                      <span className="font-medium">
                        {dayjs(selectedOrder.Payment.paidAt).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Sản phẩm
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.productName}
                      </h4>
                      {item.skuAttributes &&
                        Object.keys(item.skuAttributes).length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {Object.entries(item.skuAttributes)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(', ')}
                          </p>
                        )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">
                          x{item.quantity || 1}
                        </span>
                        <span className="font-medium text-primary">
                          {formatCurrency(item.skuPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Địa chỉ giao hàng
              </h3>
              <div className="flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <Icon
                  icon={iconsStatusOrder.localShipping}
                  className="text-xl text-gray-400 mt-0.5"
                />
                <div>
                  <p className="font-medium">
                    {selectedOrder.addressShip?.name || 'or'}
                  </p>
                  <p className="text-gray-600">
                    {selectedOrder.addressShip?.phone || '0123456789'}
                  </p>
                  <p className="text-gray-600">
                    {selectedOrder.addressShip?.address},{' '}
                    {selectedOrder.addressShip?.divisionPath['WARD']},{' '}
                    {selectedOrder.addressShip?.divisionPath['DISTRICT']},{' '}
                    {selectedOrder.addressShip?.divisionPath['PROVINCE']}
                    123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Đơn hàng được tạo</p>
                    <p className="text-xs text-gray-500">
                      {dayjs(selectedOrder.createdAt).format(
                        'DD/MM/YYYY HH:mm',
                      )}
                    </p>
                  </div>
                </div>
                {selectedOrder.updatedAt && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cập nhật trạng thái</p>
                      <p className="text-xs text-gray-500">
                        {dayjs(selectedOrder.updatedAt).format(
                          'DD/MM/YYYY HH:mm',
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {selectedOrder && getActionButtons(selectedOrder.status)}
          <Button onClick={handleCloseModal} variant="outline">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default DetailOrderModel;
