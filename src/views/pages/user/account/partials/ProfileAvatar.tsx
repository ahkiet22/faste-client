'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { User, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type TProps = {
  avatar: string | File | null;
  onChange?: (file: File) => void;
};

export function ProfileAvatar({ avatar, onChange }: TProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (avatar instanceof File) {
      const url = URL.createObjectURL(avatar);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof avatar === 'string') {
      setPreviewUrl(avatar);
    } else {
      setPreviewUrl(null);
    }
  }, [avatar]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onChange) {
      onChange(file);
    }
  };

  return (
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-border relative">
        {previewUrl ? (
          <Image
            width={100}
            height={100}
            src={previewUrl}
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
