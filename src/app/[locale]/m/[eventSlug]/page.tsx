'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Product = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  soldPercent: number;
};

type FlashSaleData = {
  eventName: string;
  endsAt: string;
  banner: string;
  products: Product[];
};

// Mock flash sale data
const mockEvents: Record<string, FlashSaleData> = {
  '11-11': {
    eventName: 'Flash Sale 11.11',
    endsAt: '2025-11-13T00:00:00Z',
    banner:
      'https://images.unsplash.com/photo-1606813902915-dce093cda7e2?q=80&w=1200',
    products: [
      {
        id: 1,
        name: 'Wireless Bluetooth Earbuds',
        price: 499000,
        salePrice: 299000,
        image:
          'https://images.unsplash.com/photo-1585386959984-a41552231693?q=80&w=600',
        soldPercent: 75,
      },
      {
        id: 2,
        name: 'Gaming Mouse RGB',
        price: 450000,
        salePrice: 199000,
        image:
          'https://images.unsplash.com/photo-1587202372775-98927b95c83b?q=80&w=600',
        soldPercent: 50,
      },
      {
        id: 3,
        name: 'Mechanical Keyboard',
        price: 950000,
        salePrice: 599000,
        image:
          'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=600',
        soldPercent: 88,
      },
      {
        id: 4,
        name: 'Smartwatch Waterproof',
        price: 1299000,
        salePrice: 799000,
        image:
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600',
        soldPercent: 30,
      },
    ],
  },
  'black-friday': {
    eventName: 'Black Friday Mega Sale',
    endsAt: '2025-11-30T00:00:00Z',
    banner:
      'https://images.unsplash.com/photo-1607083206173-6b9b36a6cf3f?q=80&w=1200',
    products: [
      {
        id: 1,
        name: 'Noise Cancelling Headphones',
        price: 2499000,
        salePrice: 1799000,
        image:
          'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=600',
        soldPercent: 60,
      },
      {
        id: 2,
        name: '4K Smart TV 50-inch',
        price: 8990000,
        salePrice: 6490000,
        image:
          'https://images.unsplash.com/photo-1587825140708-6b850a69d44d?q=80&w=600',
        soldPercent: 40,
      },
    ],
  },
};

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(endsAt).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="text-xl font-bold text-red-600 bg-red-100 px-4 py-2 rounded-lg inline-block">
      ⏰ {timeLeft}
    </div>
  );
}

export default function FlashSalePage({
  params,
}: {
  params: { eventSlug: string };
}) {
  const [data, setData] = useState<FlashSaleData | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const event = mockEvents[params.eventSlug];
    setTimeout(() => setData(event || null), 500);
  }, [params.eventSlug]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-lg">Event not found or loading...</p>
      </div>
    );
  }

  const expired = new Date(data.endsAt).getTime() < Date.now();

  return (
    <div className="flex flex-col items-center">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-80">
        <Image
          src={data.banner}
          alt={data.eventName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{data.eventName}</h1>
          <div className="mt-3">
            <CountdownTimer endsAt={data.endsAt} />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl w-full px-4 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-3">
              <p className="font-semibold line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-red-600 font-bold">
                  {product.salePrice.toLocaleString()}₫
                </span>
                <span className="text-sm line-through text-gray-400">
                  {product.price.toLocaleString()}₫
                </span>
              </div>
              <Progress value={product.soldPercent} className="mt-2 h-2" />
              <Button
                className="w-full mt-3 bg-red-500 hover:bg-red-600"
                disabled={expired}
              >
                {expired ? 'Ended' : 'Buy Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
