'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

interface QuantitySelectorProps {
  stock: number;
  quantity: number;
  setQuantity: (q: number) => void;
}

export const QuantitySelector = ({ stock, quantity, setQuantity }: QuantitySelectorProps) => {
  const handleSet = (newQuantity: number) => {
    const boundedQuantity = Math.max(1, Math.min(newQuantity, stock));
    setQuantity(boundedQuantity);
  };

  return (
    <div className="flex items-center border rounded-lg">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-full rounded-r-none" 
        onClick={() => handleSet(quantity - 1)} 
        disabled={stock === 0 || quantity <= 1}
      >
        <ChevronDown className="w-5 h-5" />
      </Button>
      
      <span className="w-14 text-center text-lg font-medium">
        {quantity}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-full rounded-l-none" 
        onClick={() => handleSet(quantity + 1)} 
        disabled={stock === 0 || quantity >= stock}
      >
        <ChevronUp className="w-5 h-5" />
      </Button>
    </div>
  );
};