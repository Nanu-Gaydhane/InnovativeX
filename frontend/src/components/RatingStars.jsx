import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} fill="currentColor" />
      ))}
      {hasHalfStar && <StarHalf size={16} fill="currentColor" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} className="text-gray-300 dark:text-gray-600" />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
        {rating > 0 ? rating.toFixed(1) : 'New'}
      </span>
    </div>
  );
};

export default RatingStars;
