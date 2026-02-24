'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-surface-alt rounded-xl flex items-center justify-center text-muted">
        אין תמונה
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-surface-alt rounded-xl overflow-hidden">
        <Image
          src={images[selected]}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                i === selected ? 'border-primary' : 'border-border hover:border-muted'
              }`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
