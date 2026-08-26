'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const GalleryLightbox = dynamic(() => import('./GalleryLightbox'), {
  ssr: false,
});

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

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center',
    transform: 'scale(1)',
  });

  useEffect(() => {
    setSelectedImage(images[0]);
    setThumbnailStartIndex(0);
    setIsLightboxOpen(false);
  }, [images]);

  const visibleThumbnails = useMemo(() => {
    return images.slice(thumbnailStartIndex, thumbnailStartIndex + 5);
  }, [images, thumbnailStartIndex]);

  const canScrollPrev = thumbnailStartIndex > 0;
  const canScrollNext = thumbnailStartIndex + 5 < images.length;

  const handlePrev = () => {
    setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setThumbnailStartIndex((prev) =>
      Math.min(Math.max(0, images.length - 5), prev + 1),
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)',
    });
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = images.indexOf(selectedImage);
    const nextIdx = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[nextIdx]);
    if (nextIdx < thumbnailStartIndex || nextIdx >= thumbnailStartIndex + 5) {
      setThumbnailStartIndex(Math.max(0, Math.min(images.length - 5, nextIdx)));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = images.indexOf(selectedImage);
    const nextIdx = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIdx]);
    if (nextIdx < thumbnailStartIndex || nextIdx >= thumbnailStartIndex + 5) {
      setThumbnailStartIndex(Math.max(0, Math.min(images.length - 5, nextIdx - 4)));
    }
  };

  return (
    <div className="w-full">
      <div
        className="relative mx-auto mb-4 aspect-square w-full max-w-[420px] cursor-zoom-in overflow-hidden rounded-lg bg-muted lg:mx-0 group"
        onClick={() => setIsLightboxOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
        aria-label="Click to open image in fullscreen"
      >
        <div
          className="w-full h-full transition-transform duration-200 ease-out"
          style={zoomStyle}
        >
          <Image
            key={selectedImage}
            src={selectedImage || '/placeholder.svg'}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover animate-fade-in"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/70 p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/95 dark:bg-black/70 dark:hover:bg-black/95 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          </button>
        )}

        {images.length > 1 && (
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/70 p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/95 dark:bg-black/70 dark:hover:bg-black/95 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          </button>
        )}
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
              className={`flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 border-2 cursor-pointer ${
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
                  loading="lazy"
                  sizes="80px"
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
      {isLightboxOpen ? (
        <GalleryLightbox
          images={images}
          selectedImage={selectedImage}
          productName={productName}
          open={isLightboxOpen}
          onOpenChange={setIsLightboxOpen}
          onSelect={setSelectedImage}
        />
      ) : null}
    </div>
  );
}
