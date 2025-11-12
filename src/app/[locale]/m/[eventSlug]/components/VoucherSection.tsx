// app/m/[eventSlug]/components/VoucherSection.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VoucherSectionProps {
  eventSlug: string;
  theme: { primary: string; secondary: string };
}

interface Voucher {
  id: string;
  code: string;
  discount: string;
  minOrder: string;
  description: string;
}

const getVouchers = (eventSlug: string): Voucher[] => {
  const baseVouchers = [
    {
      id: '1',
      code: 'FLASH50',
      discount: 'Giảm 50K',
      minOrder: 'Đơn từ 200K',
      description: 'Áp dụng cho tất cả sản phẩm'
    },
    {
      id: '2',
      code: 'FREESHIP',
      discount: 'Freeship',
      minOrder: 'Đơn từ 150K',
      description: 'Miễn phí vận chuyển'
    }
  ];

  return baseVouchers;
};

export default function VoucherSection({ eventSlug, theme }: VoucherSectionProps) {
  const vouchers = getVouchers(eventSlug);

  const VoucherCard = ({ voucher }: { voucher: Voucher }) => (
    <Card className="border-2 border-dashed" style={{ borderColor: theme.primary }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="font-bold text-lg"
                style={{ color: theme.primary }}
              >
                {voucher.discount}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{voucher.minOrder}</p>
            <p className="text-xs text-gray-500">{voucher.description}</p>
          </div>
          
          <Button 
            size="sm"
            style={{ backgroundColor: theme.primary }}
            className="ml-2"
          >
            Lưu
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono">{voucher.code}</span>
            <button className="text-xs" style={{ color: theme.primary }}>
              Sao chép
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Voucher của sự kiện</h3>
        <div className="space-y-3">
          {vouchers.map(voucher => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          Xem thêm voucher
        </Button>
      </CardContent>
    </Card>
  );
}