import React from 'react';

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
      {/* Main image - constrained, centered, premium presentation */}
      <div className="w-full flex justify-center items-center bg-white py-8 px-4 border border-border">
        <div className="w-full max-w-[85vw] md:max-w-[520px] lg:max-w-[560px]">
          <img
            src={galleryImages[activeImage]}
            alt={productName}
            className="w-full h-auto object-contain transition-opacity duration-300"
            style={{ maxHeight: '520px' }}
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
                alt={`${productName} view ${i + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
