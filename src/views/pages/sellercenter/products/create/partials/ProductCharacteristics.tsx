import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { memo, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

interface TProps {
  blockRefCharacteristics: RefObject<HTMLDivElement | null>;
}
const ProductCharacteristics = memo(function ProductCharacteristics({
  blockRefCharacteristics,
}: TProps) {
  const { t } = useTranslation();

  return (
    <div
      ref={blockRefCharacteristics}
      className="bg-white p-2 h-auto rounded-lg"
    >
      <div className="text-lg font-semibold">{t('sellercenter.products.create.characteristicsTitle')}</div>
      <div className="w-full grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="p-2 flex flex-col gap-y-2">
            <Label>{t('sellercenter.products.create.characteristicLabel', { index: index + 1 })}</Label>
            <Input value={index} placeholder={t('sellercenter.products.create.enterValue')} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default ProductCharacteristics;
