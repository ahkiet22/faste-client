import { LoadingDialog } from '@/components/loading/LoadingDialog';
import GuardLayoutWrapper from '@/hocs/GuardLayoutWrapper';
import { getDetailShopPublicBySlug } from '@/services/shop';
import LayoutPublic from '@/views/layouts/LayoutPublic';
import ShopDetails from '@/views/pages/shop/shop-details';
import { Metadata } from 'next';
import { ReactElement } from 'react';

interface ShopDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const shop = await getDetailShopPublicBySlug(params.slug);

  if (!shop.data) {
    return {
      title: 'Cửa hàng không tồn tại | FastE',
      description: 'Thông tin cửa hàng không khả dụng.',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shops/${shop.data.slug}`;

  return {
    title: `${shop.data.name} | FastE`,
    description: shop.data.description,
    alternates: { canonical: canonicalUrl },
  };
}

const Page = async ({ params }: ShopDetailPageProps) => {
  const { slug } = await params;
  const shop = await getDetailShopPublicBySlug(slug);

  if (shop.status === 'error') {
    return <div className="p-8 text-center text-red-500">{shop.message}</div>;
  }

  console.log('Shop detail:', shop);
  // Log slug to the console
  // useEffect(() => {
  //   console.log('Store slug:', slug);
  // }, [slug]);

  if (!slug) return <LoadingDialog isLoading />; // Handle case when `slug` is not available yet

  return (
    <GuardLayoutWrapper
      getLayout={(page: ReactElement) => <LayoutPublic>{page}</LayoutPublic>}
      authGuard={false}
      guestGuard={false}
    >
      <ShopDetails shop={shop.data} />
    </GuardLayoutWrapper>
  );
};

export default Page;
