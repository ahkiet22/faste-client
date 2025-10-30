import { Button } from '@/components/ui/button';

interface VoucherCardProps {
  id: string;
  type: 'freeship' | 'discount' | 'live' | 'video';
  discount: string;
  minOrder: string;
  tag?: string;
  tagColor?: 'red' | 'orange';
  conditions: string;
  validity: string;
}

export function VoucherCard({
  type,
  discount,
  minOrder,
  tag,
  tagColor = 'red',
  conditions,
  validity,
}: VoucherCardProps) {
  const typeConfig = {
    freeship: { bg: 'bg-teal-500', label: 'FREE SHIP', icon: '🚚' },
    discount: { bg: 'bg-teal-500', label: 'Lâm Đẹp', icon: '🎁' },
    live: { bg: 'bg-red-500', label: 'SHOPEE LIVE', icon: '📺' },
    video: { bg: 'bg-red-500', label: 'SHOPEE VIDEO', icon: '🎬' },
  };

  const config = typeConfig[type];

  return (
    <div className="flex gap-4 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-slate-800">
      {/* Left colored section with ticket edge */}
      <div
        className={`${config.bg} w-24 flex-shrink-0 flex flex-col items-center justify-center text-white relative`}
      >
        {/* Ticket edge effect */}
        <div className="absolute -right-3 top-0 w-6 h-6 bg-gray-50 dark:bg-slate-900 rounded-full"></div>
        <div className="absolute -right-3 bottom-0 w-6 h-6 bg-gray-50 dark:bg-slate-900 rounded-full"></div>
        <div className="text-2xl mb-1">{config.icon}</div>
        <div className="text-xs font-bold text-center px-1 leading-tight">
          {config.label}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 py-4 pr-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {discount}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {minOrder}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                ⏱ {validity}
              </span>
              <a
                href="#"
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
              >
                Điều kiện
              </a>
            </div>
          </div>

          {/* Right side with tag and button */}
          <div className="flex flex-col items-end gap-2">
            {tag && (
              <div
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  tagColor === 'red'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }`}
              >
                {tag}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
            >
              Dùng Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
