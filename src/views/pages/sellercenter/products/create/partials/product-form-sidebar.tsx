'use client';

import { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

type BlockKey =
  | 'basic'
  | 'characteristics'
  | 'pricing'
  | 'description'
  | 'shipping';
interface TProps {
  scrollToBlock: (key: BlockKey) => void;
}

const CustomPreviewSheet = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 z-50 inset-0 flex flex-col justify-end items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-40"></div>

      <div className="relative bg-white h-2/4 w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b">
          <h4 className="text-sm font-semibold">{t('sellercenter.products.create.detailInfo')}</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-2 overflow-y-auto flex-1">
          <h5 className="text-sm font-medium">{t('sellercenter.products.create.productDetailTitle')}</h5>
          <p className="text-xs text-muted-foreground mt-1">
            {t('sellercenter.products.create.productDetailHint')}
          </p>
        </div>
      </div>
    </div>
  );
};

export function ProductFormSidebar(props: TProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollToBlock } = props;
  const [sliderValue, setSliderValue] = useState([0]);
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  const toggleSection = (section: BlockKey) => {
    scrollToBlock(section);
    setExpandedSection(expandedSection === section ? '' : section);
  };
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-2">
      <Tabs defaultValue="info-product">
        <TabsList className="bg-gray-200 max-w-[400px] w-full">
          <TabsTrigger value="info-product">{t('sellercenter.products.create.productInfoTab')}</TabsTrigger>
          <TabsTrigger value="preview-product">{t('sellercenter.products.create.productPreviewTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="info-product">
          <Card className="p-4 space-y-2 flex-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">{t('sellercenter.products.create.contentScore')}</h2>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">{sliderValue[0]}</span>
              </div>
            </div>

            {/* Slider */}
            <div>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              />
              <span className="text-sm text-destructive">{t('sellercenter.products.create.poor')}</span>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Radio Group Sections */}
            <RadioGroup defaultValue="basic" className="space-y-3">
              {/* Thông tin cơ bản */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('basic')}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="basic"
                      id="basic"
                      className="text-primary"
                    />
                    <Label
                      htmlFor="basic"
                      className="cursor-pointer font-medium"
                    >
                      {t('sellercenter.products.create.basicInfo')}
                    </Label>
                  </div>
                  {expandedSection === 'basic' ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {expandedSection === 'basic' && (
                  <div className="ml-6 pl-4 border-l-2 border-muted">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-orange-500">⚠</span>
                      {t('sellercenter.products.create.addMinImages')}
                    </p>
                  </div>
                )}
              </div>

              {/* Đặc tính sản phẩm */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('characteristics')}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="characteristics"
                      id="characteristics"
                    />
                    <Label htmlFor="characteristics" className="cursor-pointer">
                      {t('sellercenter.products.create.characteristicsTitle')}
                    </Label>
                  </div>
                  {expandedSection === 'characteristics' ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {expandedSection === 'characteristics' && (
                  <div className="ml-6 pl-4 border-l-2 border-muted">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-orange-500">⚠</span>
                      {t('sellercenter.products.create.fillRequiredAttributes')}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-orange-500">⚠</span>
                      {t('sellercenter.products.create.fillMainSpecs')}
                    </p>
                  </div>
                )}
              </div>

              {/* Giá bán, Kho hàng và Biến thể */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('pricing')}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="pricing" id="pricing" />
                    <Label htmlFor="pricing" className="cursor-pointer">
                      {t('sellercenter.products.create.pricingAndStock')}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('description')}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="description" id="description" />
                    <Label htmlFor="description" className="cursor-pointer">
                      {t('sellercenter.products.create.descriptionTitle')}
                    </Label>
                  </div>
                  {expandedSection === 'description' ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {expandedSection === 'description' && (
                  <div className="ml-6 pl-4 border-l-2 border-muted">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-orange-500">⚠</span>
                      {t('sellercenter.products.create.addMinDescImages')}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-orange-500">⚠</span>
                      {t('sellercenter.products.create.addMinDescWords')}
                    </p>
                  </div>
                )}
              </div>

              {/* Vận chuyển và Bảo hành */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('shipping')}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="shipping" id="shipping" />
                    <Label htmlFor="shipping" className="cursor-pointer">
                      {t('sellercenter.products.create.shippingTitle')}
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </Card>
        </TabsContent>

        <TabsContent value="preview-product">
          <Card className="flex-1 flex items-center">
            <div className="relative h-[500px] w-[270px] overflow-hidden rounded-[3rem] border-[14px] border-gray-900 bg-white shadow-2xl cursor-grab">
              <div className="absolute left-0 right-0 top-0 z-50 flex h-6 items-center justify-between bg-black/40 px-6 text-white">
                <span className="text-xs font-medium">9:41</span>
                <div className="flex items-center gap-1">
                  <Icon icon={'mdi:signal'} />
                  <Icon icon={'material-symbols:5g'} />
                  <Icon icon={'gg:battery'} />
                </div>
              </div>
              <div className="absolute left-0 right-0 top-4 flex flex-col gap-y-2 mx-2 mt-4 border border-border rounded-md bg-gray-50 h-full overflow-y-auto hide-scrollbar">
                <div className="bg-white">
                  <div className="h-46 bg-gray-100"></div>
                  <div className="p-2 space-y-2">
                    <div className="text-xs text-red-500 font-bold">----</div>
                    <div className="text-xs text-gray-500">{t('sellercenter.products.create.zeroVariants')}</div>
                    <div className="bg-gray-100 w-6 h-6"></div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
                <div className="bg-white flex justify-between items-center p-2">
                  <div className="flex gap-x-4 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="/nftt-1.png"
                        width={64} // nên match với w-16
                        height={64} // nên match với h-16
                        alt="avatar"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-xs">Owner shop</div>
                  </div>

                  <Button
                    variant={'outline'}
                    className="bg-red-100 outline-red-300 text-red-500 hover:text-red-500 font-normal text-xs px-2 py-1 h-auto"
                  >
                    {t('sellercenter.products.create.viewMore')}
                  </Button>
                </div>
                <div className="bg-white mb-10">
                  <div className="flex justify-between items-center  p-2">
                    <div className="text-xs font-semibold">
                      {t('sellercenter.products.create.detailInfo')}
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-blue-600"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Icon
                        icon={'icon-park-outline:right'}
                        width={24}
                        height={24}
                      />
                    </Button>
                    <CustomPreviewSheet
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                    />
                  </div>
                  <div className="h-[1px] bg-gray-100 w-full"></div>
                  <div className="p-2">
                    <div className="text-xs font-semibold">{t('sellercenter.products.create.description')}</div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/4" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
