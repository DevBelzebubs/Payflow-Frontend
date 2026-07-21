'use client';

import { Star } from 'lucide-react';
import React, { useState } from 'react';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export const StarRatingInput = ({ rating, onRatingChange, disabled = false }: StarRatingInputProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={`transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            onClick={() => !disabled && onRatingChange(star)}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                isActive
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 fill-current'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
