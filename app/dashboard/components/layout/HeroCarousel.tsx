'use client'
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import MercadoPagoBanner, { AnimeBanner } from './banner/AnimeBanner';
import MegadethBanner from './banner/MegadethBanner';
import NodKraiBanner from './banner/NodKraiBanner';
import IphoneBanner from './banner/IphoneBanner';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{
    id: 'anime-hero',
    type: 'custom'
  }, {
    id: 'megadeth-hero',
    type: 'custom'
  }, {
    id: 'nodkrai-hero',
    type: 'custom',
  },{
    id:'iphone-hero',
    type: 'custom'
  }];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length])
  return (
    <div className="relative w-full h-[400px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl mb-8 group">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={cn("absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col justify-center", isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
            {slide.type === "custom" ? (
              <>
                {slide.id === "anime-hero" && <AnimeBanner active={isActive} />}
                {slide.id === "megadeth-hero" && <MegadethBanner active={isActive} />}
                {slide.id === "nodkrai-hero" && <NodKraiBanner active={isActive}/>}
                {slide.id === "iphone-hero" && <IphoneBanner active={isActive}/>}
              </>
            ) : (
              <div></div>
            )}
          </div>
        )
      })}

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