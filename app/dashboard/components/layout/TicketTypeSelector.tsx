'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Crown, User, Star } from 'lucide-react';

export interface TicketType {
  id: string;
  nombre: string;
  precio: number;
  stock_total: number;
  stock_vendido: number;
}
interface TicketTypeSelectorProps {
  ticketTypes: TicketType[];
  selectedTypeId: string | null;
  onSelect: (id: string) => void;
}

export const TicketTypeSelector = ({ ticketTypes, selectedTypeId, onSelect }: TicketTypeSelectorProps) => {
  
  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('vip') || n.includes('platinum')) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (n.includes('meet')) return <Star className="w-5 h-5 text-purple-500" />;
    return <User className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {ticketTypes.map((type) => {
        const isSelected = selectedTypeId === type.id;
        const available = type.stock_total - type.stock_vendido;
        const isSoldOut = available <= 0;
        return (
          <div
            key={type.id}
            onClick={() => !isSoldOut && onSelect(type.id)}
            className={cn(
              "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer",
              isSelected 
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md" 
                : "border-border bg-card hover:border-orange-200 dark:hover:border-orange-800",
              isSoldOut && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-background rounded-full shadow-sm">
                    {getIcon(type.nombre)}
                </div>
                <span className="font-bold text-foreground">{type.nombre}</span>
              </div>
              {isSelected && <div className="h-3 w-3 bg-orange-500 rounded-full"></div>}
            </div>
            
            <div className="mt-2">
                <span className="text-2xl font-bold text-foreground">S/ {type.precio.toFixed(2)}</span>
            </div>

            <div className="mt-2 text-xs text-muted-foreground flex justify-between">
               <span>{isSoldOut ? 'AGOTADO' : 'Disponible'}</span>
               <span>{available} entradas</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};