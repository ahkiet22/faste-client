'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { Widget } from '@/types/widget';

export interface WidgetProps {
  widget: Widget;
}

const ProductRatingWidget: React.FC<WidgetProps> = ({ widget }) => {
  if (!widget.isVisible) return null;

  // Lấy rating từ viewConfig, mặc định 4 sao
  const rating: number = widget.viewConfig?.rating ?? 4;
  const maxRating = 5;

  return (
    <div className="flex flex-col items-center p-4 border rounded shadow-sm bg-white">
      <div>Product ratting</div>
      {/* Icon widget */}
      <div className="text-3xl mb-2">
        <Icon icon={widget.icon} />
      </div>

      {/* Label */}
      <div className="text-lg font-semibold mb-1">{widget.label}</div>

      {/* Star rating */}
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.37-2.447a1 1 0 00-1.175 0l-3.37 2.447c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.067 9.393c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.966z" />
          </svg>
        ))}
      </div>

      {/* Optional: additional text */}
      {widget.viewConfig?.description && (
        <p className="text-sm text-gray-500 mt-2">
          {widget.viewConfig.description}
        </p>
      )}
    </div>
  );
};

export default ProductRatingWidget;
