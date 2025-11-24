'use client'
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import MercadoPagoBanner from './banner/MercadoPagoBanner';

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [{
        id: 'anime-hero',
        type: 'custom'
    }, {
        id: 'promo-bcp',
        type: 'standard',
        title: 'Integramos BCP',
        desc: 'Paga tus servicios directamente con tu cuenta de banco de forma segura.',
        bg: 'bg-gradient-to-r from-blue-900 to-blue-800',
        icon: <ShieldCheck className="w-12 h-12 text-blue-400" />
    }, {
        id: 'promo-fast',
        type: 'standard',
        title: 'Velocidad Payflow',
        desc: 'Tus transacciones se procesan en tiempo real. Sin esperas.',
        bg: 'bg-gradient-to-r from-orange-600 to-red-600',
        icon: <Zap className="w-12 h-12 text-yellow-300" />
    }];
    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        },6000);
        return () => clearInterval(interval);
    },[slides.length])
   return (
    <div className="relative w-full h-[400px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl mb-8 group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn("absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col justify-center", index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
          {slide.type === 'custom' && (
                <MercadoPagoBanner></MercadoPagoBanner>
          )}
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === currentSlide ? "w-8 bg-orange-500" : "bg-white/50 hover:bg-white"
            )}
          />
        ))}
      </div>
    </div>
  );
}
export default HeroCarousel;