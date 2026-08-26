'use client';

import Image from 'next/image';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  images: string[];
  selectedImage: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (image: string) => void;
};

export default function GalleryLightbox({
  images,
  selectedImage,
  productName,
  open,
  onOpenChange,
  onSelect,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        const nextIdx = (images.indexOf(selectedImage) + 1) % images.length;
        onSelect(images[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx =
          (images.indexOf(selectedImage) - 1 + images.length) % images.length;
        onSelect(images[prevIdx]);
      } else if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, selectedImage, images, onSelect, onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Fullscreen panel — inset-0, no translate, no max-w */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center outline-none"
        >
          <div className="flex w-full max-w-[1200px] h-full flex-col items-center justify-center gap-4 px-4 py-10 md:flex-row md:gap-6">
            {/* Vertical thumbnails — desktop only */}
            <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-1 shrink-0">
              {images.map((image, index) => (
                <Thumbnail
                  key={`${image}-${index}`}
                  image={image}
                  index={index}
                  selected={selectedImage === image}
                  onSelect={onSelect}
                />
              ))}
            </div>

            {/* Main image area */}
            <div className="relative flex-1 w-full h-full min-h-[300px] flex items-center justify-center group">
              {/* Explicit relative container so next/image fill has a positioned parent */}
              <div className="relative w-full" style={{ height: 'min(80vh, 100%)' }}>
                <Image
                  key={selectedImage}
                  src={selectedImage}
                  alt={productName}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-contain animate-fade-in"
                  priority
                />
              </div>

              {/* Left arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx =
                      (images.indexOf(selectedImage) - 1 + images.length) %
                      images.length;
                    onSelect(images[prevIdx]);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 p-3 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 cursor-pointer"
                  aria-label="Previous fullscreen image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Right arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx =
                      (images.indexOf(selectedImage) + 1) % images.length;
                    onSelect(images[nextIdx]);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/20 p-3 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 cursor-pointer"
                  aria-label="Next fullscreen image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Horizontal thumbnails — mobile only */}
            <div className="flex md:hidden gap-2 overflow-x-auto w-full hide-scrollbar shrink-0 pb-1">
              {images.map((image, index) => (
                <Thumbnail
                  key={`${image}-${index}`}
                  image={image}
                  index={index}
                  selected={selectedImage === image}
                  onSelect={onSelect}
                  mobile
                />
              ))}
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-20 cursor-pointer rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/40"
            aria-label="Close fullscreen"
          >
            ✕
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Thumbnail({
  image,
  index,
  selected,
  onSelect,
  mobile = false,
}: {
  image: string;
  index: number;
  selected: boolean;
  onSelect: (image: string) => void;
  mobile?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(image)}
      className={`relative flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 ${
        mobile ? 'h-16 w-16' : 'h-20 w-20'
      } ${selected ? 'border-red-500 ring-2 ring-red-300' : 'border-transparent hover:border-gray-400'}`}
      aria-label={`Select fullscreen image ${index + 1}`}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes={mobile ? '64px' : '80px'}
        className="object-cover"
      />
    </button>
  );
}
