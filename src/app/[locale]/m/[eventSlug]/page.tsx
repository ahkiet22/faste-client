// app/m/[eventSlug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventHero from './components/EventHero';
import CountdownTimer from './components/CountdownTimer';
import ProductTabs from './components/ProductTabs';
import VoucherSection from './components/VoucherSection';
import CategoryGrid from './components/CategoryGrid';
import { EventPageData, PageProps } from '@/types/event';
import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import { ReactElement } from 'react';

// Mock data với eventSlug support
export const mockEventData: Record<string, EventPageData> = {
  'flash-sale': {
    eventSlug: 'flash-sale',
    eventConfig: {
      theme: {
        primaryColor: '#EE4D2D',
        secondaryColor: '#FF6B35',
        backgroundColor: '#FFF5F3',
      },
      seo: {
        title: 'Flash Sale - Ưu đãi siêu tốc | Shopee',
        description:
          'Khám phá ưu đãi flash sale với giá sốc, giờ vàng duy nhất trong ngày',
        keywords: ['flash sale', 'sale', 'ưu đãi', 'giá rẻ'],
      },
      timing: {
        startTime: '2024-01-15T09:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        timezone: 'Asia/Ho_Chi_Minh',
      },
    },
    page: {
      config: {
        displayMap: {
          hero: 1,
          countdown: 1,
          vouchers: 1,
          categories: 1,
          products: 1,
        },
      },
    },
    layout: {
      component_list: [
        {
          id: 1,
          biz_component_id: 101,
          fe_id: 'event-hero',
          properties: '{"title": "FLASH SALE", "subtitle": "Ưu đãi siêu tốc"}',
          extend_info: '{}',
        },
      ],
    },
  },
  '11-11': {
    eventSlug: '11-11',
    eventConfig: {
      theme: {
        primaryColor: '#FF6B35',
        secondaryColor: '#FF8C42',
        backgroundColor: '#FFF8F0',
      },
      seo: {
        title: 'Sale 11.11 - Siêu hội mua sắm | Shopee',
        description: 'Sale 11.11 - Cơ hội mua sắm với ưu đãi lớn nhất năm',
        keywords: ['11.11', 'sale', 'mua sắm', 'ưu đãi'],
      },
      timing: {
        startTime: '2024-11-11T00:00:00Z',
        endTime: '2024-11-11T23:59:59Z',
        timezone: 'Asia/Ho_Chi_Minh',
      },
    },
    page: {
      config: {
        displayMap: {
          hero: 1,
          countdown: 1,
          vouchers: 1,
          categories: 1,
          products: 1,
        },
      },
    },
    layout: {
      component_list: [],
    },
  },
  'black-friday': {
    eventSlug: 'black-friday',
    eventConfig: {
      theme: {
        primaryColor: '#000000',
        secondaryColor: '#333333',
        backgroundColor: '#F5F5F5',
      },
      seo: {
        title: 'Black Friday - Siêu sale cuối năm | Shopee',
        description: 'Black Friday - Ưu đãi đặc biệt, giảm giá sâu',
        keywords: ['black friday', 'sale', 'giảm giá'],
      },
      timing: {
        startTime: '2024-11-29T00:00:00Z',
        endTime: '2024-11-29T23:59:59Z',
        timezone: 'Asia/Ho_Chi_Minh',
      },
    },
    page: {
      config: {
        displayMap: {
          hero: 1,
          countdown: 1,
          vouchers: 1,
          categories: 1,
          products: 1,
        },
      },
    },
    layout: {
      component_list: [],
    },
  },
};

const getEventData = async (eventSlug: string): Promise<EventPageData> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  const eventData = mockEventData[eventSlug];
  if (!eventData) {
    notFound();
  }

  return eventData;
};

const getEventTheme = (eventSlug: string) => {
  const themes = {
    'flash-sale': { primary: '#EE4D2D', secondary: '#FF6B35' },
    '11-11': { primary: '#FF6B35', secondary: '#FF8C42' },
    'black-friday': { primary: '#000000', secondary: '#333333' },
  };
  return themes[eventSlug as keyof typeof themes] || themes['flash-sale'];
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const eventData = await getEventData(params.eventSlug);

  return {
    title: eventData.eventConfig.seo.title,
    description: eventData.eventConfig.seo.description,
    keywords: eventData.eventConfig.seo.keywords,
    openGraph: {
      title: eventData.eventConfig.seo.title,
      description: eventData.eventConfig.seo.description,
      type: 'website',
      url: `https://shopee.vn/m/${params.eventSlug}`,
    },
  };
}

export async function generateStaticParams() {
  return [
    { eventSlug: 'flash-sale' },
    { eventSlug: '11-11' },
    { eventSlug: 'black-friday' },
  ];
}

export default async function EventPage({ params, searchParams }: PageProps) {
  const eventData = await getEventData(params.eventSlug);
  const theme = getEventTheme(params.eventSlug);

  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={false}
      guestGuard={false}
    >
      <div
        className="min-h-screen"
        style={{ backgroundColor: eventData.eventConfig.theme.backgroundColor }}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Event Hero */}
          {eventData.page.config.displayMap.hero && (
            <EventHero
              eventSlug={params.eventSlug}
              theme={theme}
              config={eventData.layout.component_list.find(
                (comp) => comp.fe_id === 'event-hero',
              )}
            />
          )}

          {/* Countdown Timer */}
          {eventData.page.config.displayMap.countdown && (
            <CountdownTimer
              startTime={eventData.eventConfig.timing.startTime}
              endTime={eventData.eventConfig.timing.endTime}
              timezone={eventData.eventConfig.timing.timezone}
              theme={theme}
              eventSlug={params.eventSlug}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <div className="lg:col-span-1">
              {/* Voucher Section */}
              {eventData.page.config.displayMap.vouchers && (
                <VoucherSection eventSlug={params.eventSlug} theme={theme} />
              )}

              {/* Category Grid */}
              {eventData.page.config.displayMap.categories && (
                <CategoryGrid eventSlug={params.eventSlug} />
              )}
            </div>

            <div className="lg:col-span-3">
              {/* Product Tabs */}
              {eventData.page.config.displayMap.products && (
                <ProductTabs
                  eventSlug={params.eventSlug}
                  initialTab={searchParams.tab}
                  initialCategory={searchParams.category}
                  theme={theme}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </GuardLayoutWrapper>
  );
}
