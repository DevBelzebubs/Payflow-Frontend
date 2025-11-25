"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const MegadethBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className="w-full bg-[#39B5C3] rounded-[32px] relative overflow-hidden flex flex-col md:flex-row items-center px-8 py-10 md:px-12 md:py-0 shadow-sm min-h-[350px] md:min-h-[400px]"
    >
      {isVisible && (
        <>
          <div className="order-2 md:order-1 w-full md:w-1/2 flex items-end justify-center md:justify-start h-full pt-6 md:pt-10 animate-in slide-in-from-left-10 fade-in duration-1000 fill-mode-both">
            <img
              src="/assets/megadeth.svg"
              alt="Megadeth en vivo"
              className="w-auto h-[250px] md:h-[380px] object-contain object-bottom"
            />
          </div>
          <div className="order-1 md:order-2 w-full md:w-1/2 flex flex-col items-start justify-center space-y-4 z-10 pb-6 md:pb-0">
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight max-w-lg animate-in slide-in-from-right-10 fade-in duration-700 fill-mode-both">
              Escucha symphony of destruction de Megadeth en vivo!
            </h2>

            <p className="text-white text-lg md:text-xl font-medium opacity-95 animate-in slide-in-from-right-10 fade-in duration-700 delay-200 fill-mode-both">
              Entradas a la venta!
            </p>

            <div className="animate-in slide-in-from-right-10 fade-in duration-700 delay-300 fill-mode-both">
              <Button
                className="bg-white text-[#F06424] hover:bg-gray-50 rounded-xl px-8 py-6 text-lg font-bold transition-all hover:scale-105 shadow-sm"
              >
                Compra acá
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MegadethBanner;