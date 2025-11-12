// app/m/[eventSlug]/components/CategoryGrid.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';

interface CategoryGridProps {
  eventSlug: string;
}

const categories = [
  { id: 'smartphones', name: 'Điện thoại', icon: '📱', count: 1245 },
  { id: 'laptops', name: 'Laptop', icon: '💻', count: 892 },
  { id: 'tablets', name: 'Máy tính bảng', icon: '📟', count: 567 },
  { id: 'audio', name: 'Âm thanh', icon: '🎧', count: 1234 },
  { id: 'wearables', name: 'Đồng hồ', icon: '⌚', count: 789 },
  { id: 'cameras', name: 'Máy ảnh', icon: '📷', count: 456 },
];

export default function CategoryGrid({ eventSlug }: CategoryGridProps) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Danh mục nổi bật</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
            >
              <span className="text-2xl mr-3">{category.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count.toLocaleString()} sản phẩm</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}