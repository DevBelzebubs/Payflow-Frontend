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

  // Rotación automática del carrusel (opcional, pausar si el usuario interactúa es buena UX, pero lo mantendremos simple)
  useEffect(() => {
    if (allImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % allImages.length);
    }, 5000); // Aumentado a 5s para dar más tiempo de ver la imagen

    return () => clearInterval(timer);
  }, [currentIndex, allImages.length]);

  const selectedImage = allImages[currentIndex]?.url_imagen || null;

  useEffect(() => {
    setCurrentIndex(0);
  }, [allImages]);

  if (allImages.length === 0) {
    return (
      <div className="w-full min-h-[450px] bg-secondary/20 flex items-center justify-center rounded-lg border border-border">
        <Package className="w-24 h-24 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Contenedor Principal */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-white dark:bg-card rounded-xl overflow-hidden border border-border shadow-sm flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage} 
            src={selectedImage || ''}
            alt="Vista principal del producto"
            
            // Animación suave de opacidad y escala
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            
            // CLAVE: object-contain para ver la imagen completa
            className="w-full h-full object-contain p-4" 
          />
        </AnimatePresence>
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((img, index) => (
            <button
              key={img.id || `img-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-white",
                currentIndex === index 
                  ? "border-orange-500 shadow-md ring-2 ring-orange-500/20" 
                  : "border-border opacity-70 hover:opacity-100 hover:border-orange-300"
              )}
            >
              <img 
                src={img.url_imagen} 
                alt="Vista miniatura" 
                className="w-full h-full object-contain p-1" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};