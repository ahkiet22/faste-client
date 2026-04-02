import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@iconify/react';
import { memo } from 'react';

interface TProps {
  shop: any;
}

const ShopInfo = memo(function ShopInfo({ shop }: TProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Stats Section */}
        <div className="lg:col-span-1 space-y-4">
          {/* Cancel Rate Card */}
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tỉ lệ huỷ</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon
                        icon="mdi:information-outline"
                        className="w-4 h-4 text-muted-foreground hover:text-foreground"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tỉ lệ đơn hàng bị huỷ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {shop.cancelRate}%
              </div>
            </CardContent>
          </Card>

          {/* Return Rate Card */}
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Tỉ lệ đối trả
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon
                        icon="mdi:information-outline"
                        className="w-4 h-4 text-muted-foreground hover:text-foreground"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tỉ lệ sản phẩm được đổi trả</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {shop.returnRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Shop Info Section */}
        <div className="lg:col-span-2">
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-0 space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{shop.name}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {shop.businessType}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Icon icon="mdi:star" className="w-5 h-5" />
                  <span className="font-semibold text-foreground">
                    {shop.ratingStar} / 5 ★
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({shop.ratingCount})
                  </span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {shop.description}
                </p>
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {/* Year Joined */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:calendar"
                    className="w-4 h-4 text-muted-foreground"
                  />
                  <span>Thành viên từ năm</span>
                  <span className="font-semibold">{shop.yearJoined}</span>
                </div>

                {/* Products */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:package-variant"
                    className="w-4 h-4 text-muted-foreground"
                  />
                  <span>Sản phẩm</span>
                  <span className="font-semibold">{shop.products}</span>
                </div>

                {/* Followers */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:account-group"
                    className="w-4 h-4 text-muted-foreground"
                  />
                  <span>Người theo dõi</span>
                  <span className="font-semibold">{shop.followers}</span>
                </div>

                {/* Response Rate */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:message-reply"
                    className="w-4 h-4 text-muted-foreground"
                  />
                  <span>Phản hồi Chat</span>
                  <span className="font-semibold">{shop.responseRate}%</span>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:clock-fast"
                    className="w-4 h-4 text-muted-foreground"
                  />
                  <span>Thời gian phản hồi</span>
                  <span className="font-semibold">{shop.responseTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default ShopInfo
