'use client';

import { useRef } from 'react';
import { ProductFormSidebar } from './partials/product-form-sidebar';

export const CreateProductPage = () => {
  const blockRefs = {
    basic: useRef(null),
    characteristics: useRef(null),
    pricing: useRef(null),
    description: useRef(null),
    shipping: useRef(null),
  };

  const scrollToBlock = (key: string) => {
    blockRefs[key].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  return (
    <div>
      <div>Tạo sản phẩm mới</div>
      <div className="flex justify-between gap-x-4">
        <div className="w-3/4 flex flex-col gap-y-4">
          <div
            ref={blockRefs.basic}
            className="bg-white p-2 h-[500px] rounded-lg"
          >
            <div>Thông tin cơ bản</div>
          </div>
          <div
            ref={blockRefs.characteristics}
            className="bg-white p-2 h-[500px] rounded-lg"
          >
            <div>Đặc tính sản phẩm</div>
          </div>
          <div
            ref={blockRefs.pricing}
            className="bg-white p-2 h-[500px] rounded-lg"
          >
            Giá bán, Kho hàng và Biến thể
          </div>
          <div
            ref={blockRefs.description}
            className="bg-white p-2 h-[500px] rounded-lg"
          >
            Mô tả sản phẩm
          </div>
          <div
            ref={blockRefs.shipping}
            className="bg-white p-2 h-[500px] rounded-lg"
          >
            Vận chuyển và bảo hành
          </div>
        </div>
        <div className="w-1/4 relative">
          <div className="sticky top-4">
            <ProductFormSidebar scrollToBlock={scrollToBlock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
