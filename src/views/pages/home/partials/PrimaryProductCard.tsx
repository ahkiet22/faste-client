import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';

const PrimaryProductCard = () => {
  return (
    <Card className="rounded-none bg-white dark:bg-black h-full w-full hover:shadow-accent-foreground text-xs gap-y-1 p-0 border-none transition-all duration-300 ease-in-out overflow-hidden relative">
      <Image
        // src="/primary-product.png"
        src="https://coreldrawdesign.com/resources/previews/preview-summer-sales-banner-design-template-cdr-vector-sale-1686309669.webp"
        alt="primary product"
        width={800}
        height={400}
        className="w-full h-full object-cover"
      />
      <Button className="text-blue-400 absolute bottom-2 left-2 z-10 cursor-pointer bg-white hover:bg-blue-50 flex items-center gap-1" variant={'outline'}>
        <span>Xem thêm</span>
        <Icon icon="weui:arrow-filled" width="12" height="24" />
      </Button>
    </Card>
  );
};
export default PrimaryProductCard;
