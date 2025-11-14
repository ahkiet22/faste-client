'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu popup đã được hiển thị trước đó
    const hasSeenPopup = localStorage.getItem('popup_shown');

    if (!hasSeenPopup) {
      setIsVisible(true);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    localStorage.setItem('popup_shown', 'true');
  };

  return (
    isVisible && (
      <Dialog open={isVisible} onOpenChange={setIsVisible}>
        <DialogContent
          className="flex flex-col items-center justify-center bg-transparent border-0 border-transparent outline-none border-none shadow-none rounded-xl w-[380px] h-[500px]"
          showCloseButton={false}
        >
          <Button
            onClick={closePopup}
            className="absolute top-2 right-2 w-8 h-8 text-blue-500 bg-white  rounded-full p-2 hover:bg-gray-200 focus:outline-none cursor-pointer"
          >
            <X />
          </Button>
          <Image
            src={
              'https://salt.tikicdn.com/ts/tikimsp/ff/69/10/7b80a9093949c7f8f10dcc45661d64d9.png'
            }
            width={500}
            height={500}
            alt="Welcome"
            className="w-full h-full"
          />
        </DialogContent>
      </Dialog>
    )
  );
};

export default WelcomePopup;
