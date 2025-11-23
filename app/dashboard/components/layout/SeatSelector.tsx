'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Accessibility } from 'lucide-react';

interface SeatSelectorProps {
  occupiedSeats: { row: string; col: number }[];
  onSelectionChange: (selectedSeats: { row: string; col: number }[]) => void;
  price: number;
}

export const SeatSelector = ({ occupiedSeats, onSelectionChange, price }: SeatSelectorProps) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  
  const leftGroup = [1, 2, 3];
  const centerGroup = [4, 5, 6, 7, 8, 9, 10, 11];
  const rightGroup = [12, 13]; 

  const [selected, setSelected] = useState<{ row: string; col: number }[]>([]);

  const isOccupied = (r: string, c: number) => 
    occupiedSeats.some(s => s.row === r && s.col === c);

  const isSelected = (r: string, c: number) => 
    selected.some(s => s.row === r && s.col === c);

  const toggleSeat = (row: string, col: number) => {
    if (isOccupied(row, col)) return;

    let newSelected;
    if (isSelected(row, col)) {
      newSelected = selected.filter(s => !(s.row === row && s.col === col));
    } else {
      newSelected = [...selected, { row, col }];
    }
    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  const renderSeat = (row: string, col: number) => {
    const occupied = isOccupied(row, col);
    const active = isSelected(row, col);

    return (
      <button
        key={`${row}-${col}`}
        disabled={occupied}
        onClick={() => toggleSeat(row, col)}
        className={cn(
          "group relative m-[1px] transition-all duration-200 focus:outline-none",
          "h-6 w-6 sm:h-8 sm:w-8", 
          occupied 
            ? "cursor-not-allowed" 
            : "cursor-pointer hover:-translate-y-0.5",
        )}
        title={`Fila ${row} - Asiento ${col}`}
      >
        <div className={cn(
          "absolute inset-0 rounded-t-md rounded-b-sm border shadow-sm transition-colors",
          occupied && "bg-red-500 border-red-600 dark:bg-red-900/80 dark:border-red-800",
          !occupied && active && "bg-[#0033A0] border-[#0033A0] dark:bg-blue-600 dark:border-blue-600",
          !occupied && !active && "bg-white border-gray-300 dark:bg-slate-800 dark:border-slate-600 hover:border-orange-400 dark:hover:border-orange-500"
        )}>
          <div className={cn(
            "absolute bottom-1 left-0.5 right-0.5 h-1 rounded-[1px] opacity-20",
            occupied || active ? "bg-black" : "bg-gray-300 dark:bg-slate-600"
          )} />
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center w-full select-none">
      
      <div className="w-full max-w-md mb-8 relative flex justify-center px-4">
        <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-[100%] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_-5px_rgba(255,255,255,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 dark:to-black/40"></div>
        </div>
        <span className="absolute -bottom-6 text-[10px] font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase">
          Pantalla
        </span>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-b from-gray-100/40 to-transparent dark:from-white/5 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }}></div>
      </div>

      <div className="w-full overflow-x-auto flex justify-center no-scrollbar">
        <div className="flex flex-col gap-1 min-w-fit px-2 pb-4">
            {rows.map(row => (
            <div key={row} className="flex items-center justify-center gap-3 sm:gap-6">
                
                <span className="w-3 text-[10px] sm:text-xs font-bold text-gray-400 dark:text-slate-500 text-center">{row}</span>

                <div className="flex gap-0.5">
                {leftGroup.map(col => renderSeat(row, col))}
                </div>

                <div className="flex gap-0.5">
                {centerGroup.map(col => renderSeat(row, col))}
                </div>

                <div className="flex gap-0.5 w-[50px] sm:w-[66px] justify-center"> 
                {(row === 'L' || row === 'M' || row === 'N') ? (
                    rightGroup.map(col => renderSeat(row, col))
                ) : (
                    row === 'K' ? (
                        <div className="flex items-center justify-center w-full h-full opacity-60">
                            <div className="bg-blue-500 p-0.5 rounded">
                                <Accessibility className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                        </div>
                    ) : null
                )}
                </div>

            </div>
            ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6 py-3 px-4 bg-gray-50/50 dark:bg-slate-900/30 rounded-full border border-gray-100 dark:border-slate-800/50">
        <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white border border-gray-300 dark:bg-slate-800 dark:border-slate-600"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-500 border border-red-600"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Ocupada</span>
        </div>
        <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#0033A0] border border-[#0033A0] dark:bg-blue-600 dark:border-blue-500"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Tu Selección</span>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="sticky bottom-4 mt-4 z-10 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="bg-gray-900 text-white dark:bg-orange-600 px-6 py-3 rounded-full shadow-xl flex gap-6 items-center text-sm">
                <div>
                    <span className="font-bold text-orange-400 dark:text-white">{selected.length}</span> <span className="opacity-80">butacas</span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <div>
                    <span className="opacity-80">Total:</span> <span className="font-bold ml-1">S/ {(selected.length * price).toFixed(2)}</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};