import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { memo, RefObject } from 'react';

interface TProps {
  blockRefCharacteristics: RefObject<HTMLDivElement | null>;
}
const ProductCharacteristics = memo(function ProductCharacteristics({
  blockRefCharacteristics,
}: TProps) {
  return (
    <div
      ref={blockRefCharacteristics}
      className="bg-white p-2 h-auto rounded-lg"
    >
      <div className="text-lg font-semibold">Đặc tính sản phẩm</div>
      <div className="w-full grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="p-2 flex flex-col gap-y-2">
            <Label>{`Đặc tính ${index}`}</Label>
            <Input value={index} placeholder="Nhập vào" />
          </div>
        ))}
      </div>
    </div>
  );
});

export default ProductCharacteristics;
