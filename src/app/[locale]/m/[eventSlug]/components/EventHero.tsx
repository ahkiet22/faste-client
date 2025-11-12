// app/m/[eventSlug]/components/EventHero.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EventHeroProps {
  eventSlug: string;
  theme: { primary: string; secondary: string };
  config?: any;
}

const getEventContent = (eventSlug: string) => {
  const content = {
    'flash-sale': {
      title: 'FLASH SALE',
      subtitle: 'Ưu đãi siêu tốc - Giờ vàng duy nhất',
      description: 'Mua ngay kẻo lỡ - Deal sốc mỗi giờ',
      cta: 'MUA NGAY',
    },
    '11-11': {
      title: '11.11 SALE',
      subtitle: 'Siêu hội mua sắm lớn nhất năm',
      description: 'Hàng ngàn ưu đãi đặc biệt chào đón 11.11',
      cta: 'KHÁM PHÁ NGAY',
    },
    'black-friday': {
      title: 'BLACK FRIDAY',
      subtitle: 'Siêu sale cuối năm - Giảm giá sâu',
      description: 'Cơ hội mua sắm tốt nhất với ưu đãi đặc biệt',
      cta: 'MUA SẮM NGAY',
    },
  };

  return content[eventSlug as keyof typeof content] || content['flash-sale'];
};

export default function EventHero({
  eventSlug,
  theme,
  config,
}: EventHeroProps) {
  const content = getEventContent(eventSlug);

  return (
    <Card className="overflow-hidden border-0 shadow-lg h-full p-0">
      <CardContent className="p-0 h-full">
        <div
          className="relative h-full bg-cover bg-center flex items-center"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10 text-white p-8 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                {content.title}
              </h1>
              <p className="text-xl md:text-2xl font-semibold">
                {content.subtitle}
              </p>
              <p className="text-lg opacity-90">{content.description}</p>

              <button
                className="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors mt-4"
                style={{ color: theme.primary }}
              >
                {content.cta}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
