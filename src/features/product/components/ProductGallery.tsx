import React from 'react';
import { responsiveImage } from '../../../lib/responsiveImage';

interface ProductGalleryProps {
  productName: string;
  galleryImages: string[];
  activeImage: number;
  setActiveImage: (index: number) => void;
}

export function ProductGallery({
  productName,
  galleryImages,
  activeImage,
  setActiveImage,
}: ProductGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main image - constrained, centered, premium presentation.
          The frame is a fixed square, the same shape as the shop cards, so
          switching between photos of different proportions never resizes it
          or shifts the page. Product photos are squared in public/images to
          fill it; object-contain is the fallback for one that is not. */}
      <div className="w-full flex justify-center items-center bg-white py-8 px-4 border border-border">
        <div className="w-full max-w-[85vw] md:max-w-[520px] aspect-square">
          {/* The LCP element on a product page, so it is told to jump the
              queue and is never lazy. The thumbnails below are. */}
          <img
            src={galleryImages[activeImage]}
            {...responsiveImage(galleryImages[activeImage], '(min-width: 1024px) 50vw, 100vw')}
            alt={productName}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-contain transition-opacity duration-300"
          />
        </div>
      </div>
      {galleryImages.length > 1 && (
        <div className="flex gap-2 px-1">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`w-20 h-20 bg-white overflow-hidden border-2 transition-colors flex items-center justify-center ${
                activeImage === i ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <img
                src={img}
                {...responsiveImage(img, '96px')}
                alt={`${productName} view ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
