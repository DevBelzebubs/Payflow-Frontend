"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BannerProps {
  active?: boolean;
}

export const IphoneBanner = ({ active = false }: BannerProps) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (active) {
      setAnimKey(prev => prev + 1);
    }
  }, [active]);

  return (
    <div
      className="w-full bg-gradient-to-r from-[#89D746] to-[#32CA95] rounded-[32px] relative overflow-hidden flex flex-col md:flex-row items-center px-8 py-10 md:px-14 md:py-0 shadow-sm min-h-[350px] md:min-h-[400px]"
    >
      <React.Fragment key={animKey}>
        <div className="w-full md:w-[55%] flex flex-col items-start justify-center space-y-6 z-10 pb-6 md:pb-0">
          <h2 className="text-3xl md:text-4xl lg:text-[46px] font-bold text-white leading-[1.15] max-w-md animate-in slide-in-from-left-10 fade-in duration-700 fill-mode-both">
            Tu nuevo iPhone a cuotas sin intereses
          </h2>
          <p className="text-white text-lg md:text-xl font-medium animate-in slide-in-from-left-10 fade-in duration-700 delay-200 fill-mode-both">
            Stock disponible!
          </p>

          <div className="animate-in slide-in-from-left-10 fade-in duration-700 delay-300 fill-mode-both pt-2">
            <Button
              className="bg-white text-[#E8651A] hover:bg-gray-50 rounded-xl px-8 py-6 text-base md:text-lg font-bold transition-all hover:scale-105 shadow-md"
            >
              Compra acá
            </Button>
          </div>
        </div>
        <div className="w-full md:w-[55%] h-full flex items-end justify-center md:absolute md:right-0 md:bottom-0 pointer-events-none animate-in slide-in-from-right-10 fade-in duration-1000 fill-mode-both">
          <img
            src="/assets/iphone-group.svg" 
            alt="iPhone 15 Modelos"
            className="w-auto h-[250px] md:h-[380px] lg:h-[440px] object-contain object-bottom mb-0 md:-mr-10 lg:-mr-4"
          />
        </div>

      </React.Fragment>
    </div>
  );
};

export default IphoneBanner;