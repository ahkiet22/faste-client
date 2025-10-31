'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';

interface ProductGalleryProps {
  images: string[];
  productName?: string;
}

export function ImageGallery({
  images,
  productName = 'Product',
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const visibleThumbnails = useMemo(() => {
    return images.slice(thumbnailStartIndex, thumbnailStartIndex + 5);
  }, [images, thumbnailStartIndex]);

  const canScrollPrev = thumbnailStartIndex > 0;
  const canScrollNext = thumbnailStartIndex + 5 < images.length;

  const handlePrev = () => {
    setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setThumbnailStartIndex((prev) => Math.min(images.length - 5, prev + 1));
  };

  return (
    <div className="w-full">
      <div
        className="w-[420px] h-[420px] mb-4 cursor-zoom-in overflow-hidden rounded-lg bg-muted"
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
        aria-label="Click to open image in fullscreen"
      >
        <Image
          src={selectedImage || '/placeholder.svg'}
          alt={productName}
          width={1000}
          height={1000}
          className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
          priority
        />
      </div>

      <div className="relative flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={handlePrev}
          disabled={!canScrollPrev}
          className="absolute left-0 z-10 rounded-full bg-white/70 p-2 shadow transition-opacity disabled:opacity-50 hover:bg-white/90 dark:bg-black/70 dark:hover:bg-black/90"
          aria-label="Previous images"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Thumbnails container */}
        <div className="flex items-center justify-between overflow-hidden max-w-full md:max-w-[420px]">
          {visibleThumbnails.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 border-2 ${
                selectedImage === img
                  ? 'border-red-500 ring-2 ring-red-300 dark:ring-red-800'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              aria-label={`Select image ${thumbnailStartIndex + idx + 1}`}
            >
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={img || '/placeholder.svg'}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canScrollNext}
          className="absolute right-0 z-10 rounded-full bg-white/70 p-2 shadow transition-opacity disabled:opacity-50 hover:bg-white/90 dark:bg-black/70 dark:hover:bg-black/90"
          aria-label="Next images"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-2 text-center text-sm text-muted-foreground">
        {images.indexOf(selectedImage) + 1} of {images.length}
      </p>
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          className="
      fixed inset-0 z-50 
      flex items-center justify-center 
      bg-black/95 border-none rounded-none p-0
    "
        >
          <div className="flex w-full max-w-[1200px] h-[80vh] items-center justify-center gap-6 px-4">
            {/* Sidebar Thumbnails */}
            <div className="w-[90px] h-full overflow-y-auto flex flex-col gap-2 pl-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    selectedImage === img
                      ? 'border-red-500 ring-2 ring-red-300'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={80}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Section */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Background (prevent layout shift) */}
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-40 transition-all duration-300"
                style={{ backgroundImage: `url(${selectedImage})` }}
              ></div>

              {/* Main Image */}
              <Image
                src={selectedImage}
                alt="Main product"
                width={1200}
                height={1200}
                className="object-contain max-h-[80vh] w-auto z-10 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Close fullscreen"
          >
            ✕
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
