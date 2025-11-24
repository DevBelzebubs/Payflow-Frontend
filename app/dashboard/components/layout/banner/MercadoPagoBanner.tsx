import React from "react";
import { Button } from "@/components/ui/button";

export const MercadoPagoBanner = () => {
  return (
    <div className="w-full bg-[#F06424] rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center px-8 py-10 md:px-14 md:py-16 shadow-sm">
      <div className="flex flex-col items-start space-y-5 z-10 max-w-xl">
        <h2 className="text-3xl md:text-4xl lg:text-[44px] font-medium text-white leading-[1.15]">
          Tu compra de entrada de cine ahora con Mercado Pago!
        </h2>
        
        <p className="text-white text-xl font-medium opacity-95">
          Pruebalo ahora!
        </p>
        
        <Button 
          className="bg-white text-[#F06424] hover:bg-gray-50 rounded-full px-8 py-6 text-lg font-bold transition-all hover:scale-105 shadow-sm mt-2"
        >
          Conoce más
        </Button>
      </div>

      <div className="mt-8 md:mt-0 md:absolute md:right-[-20px] md:bottom-[-20px] flex items-end justify-end pointer-events-none">
        <img 
          src="/assets/Collage.png" 
          alt="Personajes de Anime" 
          className="w-full max-w-[350px] md:max-w-[600px] object-contain object-bottom"
        />
      </div>
    </div>
  );
};

export default MercadoPagoBanner;