'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { AddAddressForm } from './partials/add-address-form';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  tags: string[];
  isDefault?: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Lê Anh Kiệt',
    phone: '(+84) 886 206 553',
    address: '499/4/7, Lê Quang Định\nPhường 1, Quận Gò Vấp, TP. Hồ Chí Minh',
    tags: ['Mặc định'],
    isDefault: true,
  },
  {
    id: '2',
    name: 'Lê Anh kiệt',
    phone: '(+84) 886 206 553',
    address:
      'Hòa Đo 1B-cam phúc bắc\nPhường Cam Phúc Bắc, Thành Phố Cam Ranh, Khánh Hòa',
    tags: ['Địa chỉ lấy hàng', 'Địa chỉ trả hàng'],
  },
  {
    id: '3',
    name: 'tú anh trương',
    phone: '(+84) 886 206 554',
    address:
      'Số Nhà 499, Nguyễn Thị Trang Hiền\nThị Trấn An Phú, Huyện An Phú, An Giang',
    tags: [],
  },
  {
    id: '4',
    name: 'Lê Anh kiệt',
    phone: '(+84) 886 206 553',
    address:
      'Số 324, Ung Văn Khiêm\nPhường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    tags: [],
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
        tags:
          addr.id === id
            ? [...addr.tags.filter((tag) => tag !== 'Mặc định'), 'Mặc định']
            : addr.tags.filter((tag) => tag !== 'Mặc định'),
      })),
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddAddress = (formData: any) => {
    const newAddress: Address = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      address: `${formData.address}\n${formData.ward}, ${formData.district}, ${formData.province}`,
      tags: formData.isDefault ? ['Mặc định'] : [],
      isDefault: formData.isDefault,
    };

    if (formData.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: false,
          tags: addr.tags.filter((tag) => tag !== 'Mặc định'),
        })),
      );
    }

    setAddresses((prev) => [...prev, newAddress]);
    setShowAddForm(false);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Mặc định':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Địa chỉ lấy hàng':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Địa chỉ trả hàng':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (showAddForm) {
    return (
      <AddAddressForm
        onSubmit={handleAddAddress}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-medium text-foreground">Địa chỉ của tôi</h1>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Địa chỉ</h2>

        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4 border border-border">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">
                      {address.name}
                    </span>
                    <span className="text-muted-foreground">
                      {address.phone}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {address.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs px-2 py-1 ${getTagColor(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm whitespace-pre-line">
                    {address.address}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 pr-2 md:pr-0 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto mt-2 md:mt-0">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                  >
                    Cập nhật
                  </Button>
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                    onClick={() => handleDelete(address.id)}
                  >
                    Xóa
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-muted-foreground border-border hover:bg-muted bg-transparent"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Thiết lập mặc định
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
