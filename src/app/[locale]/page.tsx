import { Dialog, DialogContent } from '@/components/ui/dialog';
import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import { getAllProductsPublic } from '@/services/product';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import HomePage from '@/views/pages/home';
import { Metadata } from 'next';
import { ReactElement } from 'react';

interface TProps {
  data: [];
  totalItem: number;
  page: number;
  limit: number;
  totalPage: number;
}

export const metadata: Metadata = {
  title: 'FastE - Mua sắm thời trang & điện tử trực tuyến',
  description:
    'FastE cung cấp các sản phẩm thời trang, điện tử chất lượng với giá tốt và giao hàng nhanh chóng.',
  keywords: [
    'FastE',
    'thời trang',
    'điện tử',
    'mua sắm online',
    'shopping',
    'fast delivery',
  ],
  viewport: 'width=device-width, initial-scale=1',
  metadataBase: new URL('https://faste.vn'),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    title: 'FastE - Mua sắm thời trang & điện tử trực tuyến',
    description:
      'FastE cung cấp các sản phẩm thời trang, điện tử chất lượng với giá tốt và giao hàng nhanh chóng.',
    siteName: 'FastE',
    url: 'https://faste.vn',
    images: [
      {
        url: 'https://faste.vn/faste.png',
        width: 1200,
        height: 630,
        alt: 'FastE - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastE - Mua sắm thời trang & điện tử trực tuyến',
    description:
      'FastE cung cấp các sản phẩm thời trang, điện tử chất lượng với giá tốt và giao hàng nhanh chóng.',
    images: [
      {
        url: 'https://faste.vn/faste.png',
        width: 1200,
        height: 630,
        alt: 'FastE - Logo',
      },
    ],
  },
  // JSON-LD schema.org cho landing page
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

async function getProductsData(): Promise<TProps> {
  const page = 1;
  const limit = 48;

  try {
    const response = await getAllProductsPublic({ page, limit });
    const products = response?.data ?? [];

    return products;
  } catch (error) {
    return {
      data: [],
      totalItem: 0,
      page,
      limit,
      totalPage: 0,
    };
  }
}
export default async function Home() {
  const products = await getProductsData();
  const { data, limit, page, totalItem, totalPage } = products;
  console.log(
    '© Copyright belongs to the account [ahkiet lekiett2201@gmail.com]. Unauthorized copying, selling, distribution, or modification is prohibited.',
  );
  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={false}
      guestGuard={false}
    >
      <div>
        © Copyright belongs to the account [ahkiet lekiett2201@gmail.com].
        Unauthorized copying, selling, distribution, or modification is
        prohibited.
      </div>
      <Dialog open={true}>
        <DialogContent
          className="flex flex-col items-center justify-center bg-transparent border-0 border-transparent outline-none border-none shadow-none rounded-xl w-[380px] h-[500px]"
          showCloseButton={false}
        >
          <div className='bg-red-600 text-white'>
            © Copyright belongs to the account [ahkiet lekiett2201@gmail.com].
            Unauthorized copying, selling, distribution, or modification is
            prohibited.
            This is a personal project.
          </div>
        </DialogContent>
      </Dialog>
      <HomePage
        data={data}
        limit={limit}
        page={page}
        totalItem={totalItem}
        totalPage={totalPage}
      />
    </GuardLayoutWrapper>
  );
}

export const dynamic = 'force-static';
export const revalidate = 60;
