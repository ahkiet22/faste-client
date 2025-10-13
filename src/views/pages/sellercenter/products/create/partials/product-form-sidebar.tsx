'use client';

import { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface TProps {
  scrollToBlock: (key: string) => void
}

export function ProductFormSidebar(props: TProps) {
  const {scrollToBlock} = props
  const [sliderValue, setSliderValue] = useState([0]);
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  const toggleSection = (section: string) => {
    scrollToBlock(section)
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">Điểm nổi dung</h2>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">{sliderValue[0]}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
          className="w-full"
        />
        <span className="text-sm text-destructive">Poor</span>
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
              <Label htmlFor="basic" className="cursor-pointer font-medium">
                Thông tin cơ bản
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
                Thêm ít nhất 3 ảnh chính
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
              <RadioGroupItem value="characteristics" id="characteristics" />
              <Label htmlFor="characteristics" className="cursor-pointer">
                Đặc tính sản phẩm
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
                Điền thuộc tính bắt buộc
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-orange-500">⚠</span>
                Điền đủ thông số chính của sản phẩm
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
                Giá bán, Kho hàng và Biến thể
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
                Mô tả sản phẩm
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
                Thêm ít nhất 1 ảnh trong mô tả
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-orange-500">⚠</span>
                Thêm mô tả dài ít nhất 30 từ
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
                Vận chuyển và Bảo hành
              </Label>
            </div>
          </div>
        </div>
      </RadioGroup>
    </Card>
  );
}
