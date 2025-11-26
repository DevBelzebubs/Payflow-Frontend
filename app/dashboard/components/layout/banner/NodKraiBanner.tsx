"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BannerProps {
  active?: boolean;
}
export const NodkraiBanner = ({ active = false }: BannerProps) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (active) {
      setAnimKey(prev => prev + 1);
    }
  }, [active]);

  return (
    <div className="w-full bg-gradient-to-br from-[#101035] to-[#353590] rounded-[32px] relative overflow-hidden flex flex-col md:flex-row items-center px-8 py-10 md:px-16 md:py-0 shadow-sm min-h-[350px] md:min-h-[400px]">
      <React.Fragment key={animKey}>
        
        <div className="w-full md:w-[55%] flex flex-col items-start justify-center space-y-6 z-10 pb-4 md:pb-0">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.2] max-w-lg animate-in slide-in-from-left-10 fade-in duration-700 fill-mode-both">
            Asegura tu personaje de nodkrai con nosotros
          </h2>

          <p className="text-gray-100 text-lg md:text-xl font-medium animate-in slide-in-from-left-10 fade-in duration-700 delay-200 fill-mode-both">
            Adquiere tus cristales génesis!
          </p>

          <div className="animate-in slide-in-from-left-10 fade-in duration-700 delay-300 fill-mode-both pt-2">
            <Button
              className="bg-white text-[#F06424] hover:bg-gray-100 rounded-xl px-8 py-6 text-base md:text-lg font-bold transition-all hover:scale-105 shadow-md"
            >
              Compra acá
            </Button>
          </div>
        </div>
        <div className="w-full md:w-[50%] h-full flex items-end justify-center md:absolute md:right-6 md:bottom-0 pointer-events-none animate-in slide-in-from-right-10 fade-in duration-1000 fill-mode-both">
          <img
            src="/assets/Durin_Portrait.svg" 
            alt="Personaje Nodkrai"
            className="w-auto h-[480px] md:h-[520px] lg:h-[580px] object-contain object-bottom mb-0 md:-mr-3 lg:mr-0"
          />
        </div>
      </React.Fragment>
    </div>
  );
};

export default NodkraiBanner;