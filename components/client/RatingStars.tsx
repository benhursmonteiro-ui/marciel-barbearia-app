import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number; // 0 to 5
    onRate?: (value: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, onRate }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
        <div className="flex space-x-1">
            {stars.map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => onRate && onRate(value)}
                    className={`w-6 h-6 ${value <= rating ? 'text-[var(--color-primary-gold)]' : 'text-gray-500'}`}
                >
                    <Star className="w-full h-full" />
                </button>
            ))}
        </div>
    );
};
