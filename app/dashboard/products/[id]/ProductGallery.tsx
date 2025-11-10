'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ImagenProducto } from '@/interfaces/Review/ImagenProducto';
import { Package } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProductGalleryProps {
  principal?: string | null;
  imagenes?: ImagenProducto[];
}

export const ProductGallery = ({ principal, imagenes }: ProductGalleryProps) => {
  
  const allImages = useMemo(() => {
    const imageList = [
      ...(principal ? [{ id: 'main', url_imagen: principal, orden: -1 }] : []), 
      ...(imagenes || []).filter(img => img.url_imagen !== principal)
    ];
    imageList.sort((a, b) => a.orden - b.orden);
    return imageList;
  }, [principal, imagenes]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, allImages.length]);

  const selectedImage = allImages[currentIndex]?.url_imagen || null;

  useEffect(() => {
    setCurrentIndex(0);
  }, [allImages]);

  if (allImages.length === 0) {
    return (
      <div className="w-full min-h-[450px] bg-gray-100 flex items-center justify-center rounded-lg">
        <Package className="w-24 h-24 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border">
        
        <AnimatePresence>
          
          <motion.img
            key={selectedImage} 
            src={selectedImage || ''}
            alt="Vista principal del producto"
            initial={{ position: 'absolute', opacity: 0 }}
            animate={{ position: 'absolute', opacity: 1 }}
            exit={{ position: 'absolute', opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((img, index) => (
            <button
              key={img.id || `img-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200",
                currentIndex === index 
                  ? "border-orange-500 opacity-100" 
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
              )}
            >
              <img src={img.url_imagen} alt="Vista miniatura" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};