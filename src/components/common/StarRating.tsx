import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'xs' | 'sm' | 'md';
  interactive?: boolean;
  onRate?: (stars: number) => void;
}

const sizeMap = { xs: 12, sm: 16, md: 20 };

export default function StarRating({ rating, size = 'sm', interactive = false, onRate }: StarRatingProps) {
  const iconSize = sizeMap[size];

  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={iconSize}
          className={star <= Math.round(rating) ? 'text-gold fill-gold' : 'text-slate-border'}
          onClick={interactive && onRate ? () => onRate(star) : undefined}
          style={interactive ? { cursor: 'pointer' } : undefined}
        />
      ))}
      <span className="text-cream-muted text-xs ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}
