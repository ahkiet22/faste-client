'use client';

import type React from 'react';

import { useState } from 'react';
import { User, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type TProps = {
  avatar: string;
};
export function ProfileAvatar(props: TProps) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <Image
            width={100}
            height={100}
            src={image || props.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-10 h-10 text-blue-500" />
        )}
      </div>
      <Button
        size="sm"
        variant="secondary"
        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full p-0 bg-gray-600 hover:bg-gray-700 cursor-pointer"
        type="button"
        onClick={() => document.getElementById('avatar-upload')?.click()}
      >
        <Edit3 className="w-3 h-3 text-white" />
      </Button>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
