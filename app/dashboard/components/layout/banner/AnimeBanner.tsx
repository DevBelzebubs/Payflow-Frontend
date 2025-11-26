"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
export const AnimeBanner = ({ active = false }: BannerProps) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (active) {
      setAnimKey(prev => prev + 1);
    }
  }, [active]);

  return (
    <div
      className="w-full bg-gradient-to-r from-[#EA864B] to-[#E8651A] rounded-[32px] relative overflow-hidden flex flex-col md:flex-row items-center px-8 py-10 md:px-14 md:py-16 shadow-sm min-h-[400px]"
    >
      <React.Fragment key={animKey}>
          <div className="flex flex-col items-start space-y-5 z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-medium text-white leading-[1.15] animate-in slide-in-from-left-10 fade-in duration-700 fill-mode-both">
              El pago de tu series de anime ahora con mercado pago!
            </h2>

            <p className="text-white text-xl font-medium opacity-95 animate-in slide-in-from-left-10 fade-in duration-700 delay-200 fill-mode-both">
              Pruebalo ahora!
            </p>

            <div className="animate-in slide-in-from-left-10 fade-in duration-700 delay-300 fill-mode-both">
              <Button className="bg-white text-[#F06424] hover:bg-gray-50 rounded-full px-8 py-6 text-lg font-bold transition-all hover:scale-105 shadow-sm mt-2">
                Conoce más
              </Button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:absolute md:right-[-20px] md:bottom-[-20px] flex items-end justify-end pointer-events-none animate-in slide-in-from-right-10 fade-in duration-1000 fill-mode-both">
            <img
              src="/assets/Collage.png"
              alt="Personajes de Anime"
              className="w-full max-w-[350px] md:max-w-[600px] object-contain object-bottom"
            />
          </div>
      </React.Fragment>
    </div>
  );
};

export default AnimeBanner;