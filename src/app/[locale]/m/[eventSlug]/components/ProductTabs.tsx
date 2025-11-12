// app/m/[eventSlug]/components/ProductTabs.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types/event';

interface ProductTabsProps {
  eventSlug: string;
  initialTab?: string;
  initialCategory?: string;
  theme: { primary: string; secondary: string };
}

// Mock products data
const mockProducts: Record<string, Product[]> = {
  electronics: [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 25990000,
      originalPrice: 29990000,
      discount: 13,
      image: '/iphone15.jpg',
      category: 'smartphones',
      sold: 150,
      stock: 50,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      price: 18990000,
      originalPrice: 22990000,
      discount: 17,
      image: '/galaxy-s24.jpg',
      category: 'smartphones',
      sold: 89,
      stock: 30,
      rating: 4.6
    }
  ],
  fashion: [
    {
      id: '3',
      name: 'Áo thun nam cao cấp',
      price: 199000,
      originalPrice: 399000,
      discount: 50,
      image: '/ao-thun.jpg',
      category: 'clothing',
      sold: 450,
      stock: 100,
      rating: 4.4
    }
  ]
};

const categories = [
  { id: 'electronics', name: 'Điện tử', icon: '📱' },
  { id: 'fashion', name: 'Thời trang', icon: '👕' },
  { id: 'home', name: 'Gia dụng', icon: '🏠' },
  { id: 'beauty', name: 'Làm đẹp', icon: '💄' },
];

export default function ProductTabs({ eventSlug, initialTab, initialCategory, theme }: ProductTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab || 'electronics');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    if (initialCategory) {
      params.set('category', initialCategory);
    }
    router.replace(`/m/${eventSlug}?${params.toString()}`, { scroll: false });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-gray-400">📱</span>
        </div>
        
        <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-lg">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-gray-500 line-through text-sm">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span 
              className="px-2 py-1 text-xs font-medium rounded"
              style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
            >
              -{product.discount}%
            </span>
            <span className="text-xs text-gray-500">Đã bán {product.sold}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                style={{ 
                  color: activeTab === category.id ? theme.primary : undefined 
                }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProducts[category.id]?.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {!mockProducts[category.id] && (
                <div className="text-center py-8 text-gray-500">
                  Không có sản phẩm nào trong danh mục này
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}