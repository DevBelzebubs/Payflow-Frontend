'use client';

import { Star } from 'lucide-react';
import React from 'react';

interface StarRatingProps {
  rating: number;
  totalReviews: number;
  showTotal?: boolean;
}

export const StarRating = ({ rating, totalReviews, showTotal = true }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 fill-current" />)}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />)}
      </div>
      {showTotal && (
        <span className="text-sm text-gray-500">({totalReviews} reseñas)</span>
      )}
    </div>
  );
};