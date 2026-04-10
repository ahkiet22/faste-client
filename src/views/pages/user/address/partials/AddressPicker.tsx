'use client';

import * as React from 'react';
import { MapPin, Check, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getDistricts,
  getStates,
  getWards,
} from '@/services/provinces.service';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { DIVISION_LEVEL } from '@/enums/division-level.constant';

const LEVELS = {
  STATE: 'state',
  DISTRICT: 'district',
  WARD: 'ward',
} as const;

interface ProvinceItem {
  id: number;
  name: string;
  parentId: string | null;
}

export interface OnChangeValueType {
  state: ProvinceItem | null;
  district: ProvinceItem | null;
  ward: ProvinceItem | null;
  divisionId: number;
}

interface AddressPickerProps {
  value?: number | string;
  onChange: (value: OnChangeValueType) => void;
  placeholder?: string;
  initialLabel?: string;
}

const ProvinceSkeleton = () => (
  <div className="flex flex-col gap-1 p-2">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="h-9 w-full animate-pulse rounded-md bg-muted/60"
      />
    ))}
  </div>
);

export function AddressPicker({
  value,
  onChange,
  placeholder,
  initialLabel,
}: AddressPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(LEVELS.STATE);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    states: [] as ProvinceItem[],
    districts: [] as ProvinceItem[],
    wards: [] as ProvinceItem[],
  });

  const [selected, setSelected] = useState({
    state: null as ProvinceItem | null,
    district: null as ProvinceItem | null,
    ward: null as ProvinceItem | null,
  });

  const displayValue = useMemo(() => {
    const parts = [
      selected.state?.name,
      selected.district?.name,
      selected.ward?.name,
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
    return initialLabel || placeholder || 'Tỉnh/Thành, Quận/Huyện, Phường/Xã';
  }, [selected, initialLabel, placeholder]);

  const fetchProvinces = useCallback(
    async (level: string, parentId?: number) => {
      setLoading(true);
      try {
        const params = { page: 1, limit: 200, parentId };

        if (level === LEVELS.STATE) {
          if (data.states.length > 0) return;
          const res = await getStates('VN', params);
          setData((prev) => ({ ...prev, states: res.data.data || [] }));
        } else if (level === LEVELS.DISTRICT && parentId) {
          const res = await getDistricts('VN', params);
          setData((prev) => ({ ...prev, districts: res.data.data || [] }));
        } else if (level === LEVELS.WARD && parentId) {
          const res = await getWards('VN', params);
          setData((prev) => ({ ...prev, wards: res.data.data || [] }));
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    },
    [data.states.length],
  );

  useEffect(() => {
    if (open && data.states.length === 0) {
      fetchProvinces(LEVELS.STATE);
    }
  }, [open, data.states.length, fetchProvinces]);

  const handleSelect = async (item: ProvinceItem, level: string) => {
    if (level === LEVELS.STATE) {
      setSelected({ state: item, district: null, ward: null });
      setData((prev) => ({ ...prev, districts: [], wards: [] }));
      setActiveTab(LEVELS.DISTRICT);
      fetchProvinces(LEVELS.DISTRICT, item.id);
    } else if (level === LEVELS.DISTRICT) {
      setSelected((prev) => ({ ...prev, district: item, ward: null }));
      setData((prev) => ({ ...prev, wards: [] }));
      setActiveTab(LEVELS.WARD);
      fetchProvinces(LEVELS.WARD, item.id);
    } else {
      setSelected((prev) => ({ ...prev, ward: item }));
      onChange({
        state: selected.state,
        district: selected.district,
        ward: item,
        divisionId: item.id,
      });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal h-11 border-input hover:bg-accent transition-all',
            !value && 'text-muted-foreground',
          )}
        >
          <div className="flex items-center gap-2 truncate mr-2">
            <MapPin
              className={cn(
                'h-4 w-4 shrink-0',
                value ? 'text-primary' : 'text-muted-foreground',
              )}
            />
            <span className="truncate">{displayValue}</span>
          </div>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronRight
              className={cn(
                'h-4 w-4 shrink-0 opacity-50 transition-transform',
                open && 'rotate-90',
              )}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full md:w-[550px] p-0 shadow-xl border-muted"
        align="start"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 bg-muted/20 rounded-none border-b p-0">
            <TabsTrigger
              value={LEVELS.STATE}
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Tỉnh/Thành
            </TabsTrigger>
            <TabsTrigger
              value={LEVELS.DISTRICT}
              disabled={!selected.state}
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Quận/Huyện
            </TabsTrigger>
            <TabsTrigger
              value={LEVELS.WARD}
              disabled={!selected.district}
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Phường/Xã
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[320px] overflow-y-auto p-1 custom-scrollbar">
            {/* TỈNH / THÀNH */}
            <TabsContent value={LEVELS.STATE} className="m-0 outline-none">
              {loading && activeTab === LEVELS.STATE ? (
                <ProvinceSkeleton />
              ) : (
                <div className="grid grid-cols-1 gap-0.5">
                  {data.states.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start font-normal h-10 px-3',
                        selected.state?.id === item.id &&
                          'bg-primary/5 text-primary font-medium',
                      )}
                      onClick={() => handleSelect(item, LEVELS.STATE)}
                    >
                      {item.name}
                      {selected.state?.id === item.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* QUẬN / HUYỆN */}
            <TabsContent value={LEVELS.DISTRICT} className="m-0 outline-none">
              {loading && activeTab === LEVELS.DISTRICT ? (
                <ProvinceSkeleton />
              ) : (
                <div className="grid grid-cols-1 gap-0.5">
                  {data.districts.length === 0 && !loading && (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      Vui lòng chọn Tỉnh/Thành trước
                    </div>
                  )}
                  {data.districts.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start font-normal h-10 px-3',
                        selected.district?.id === item.id &&
                          'bg-primary/5 text-primary font-medium',
                      )}
                      onClick={() => handleSelect(item, LEVELS.DISTRICT)}
                    >
                      {item.name}
                      {selected.district?.id === item.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* PHƯỜNG / XÃ */}
            <TabsContent value={LEVELS.WARD} className="m-0 outline-none">
              {loading && activeTab === LEVELS.WARD ? (
                <ProvinceSkeleton />
              ) : (
                <div className="grid grid-cols-1 gap-0.5">
                  {data.wards.length === 0 && !loading && (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      Vui lòng chọn Quận/Huyện trước
                    </div>
                  )}
                  {data.wards.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start font-normal h-10 px-3',
                        Number(value) === item.id &&
                          'bg-primary/5 text-primary font-medium',
                      )}
                      onClick={() => handleSelect(item, LEVELS.WARD)}
                    >
                      {item.name}
                      {Number(value) === item.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
