import { useNavigate } from 'react-router-dom';
import { Package, Users } from 'lucide-react';
import { useState } from 'react';
import type { Listing, Profile } from '../../services/dataService';
import { CATEGORIES } from '../../services/mock/mockCategories';
import VerifiedBadge from './VerifiedBadge';
import StarRating from './StarRating';
import ListingCountdown from '../student/ListingCountdown';

interface ListingCardProps {
  listing: Listing;
  seller: Profile;
}

export default function ListingCard({ listing, seller }: ListingCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const categoryLabel = CATEGORIES.find(c => c.id === listing.category)?.label ?? listing.category;

  return (
    <button
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="w-full text-left bg-slate-card border border-slate-border rounded-2xl overflow-hidden"
    >
      {imgError ? (
        <div className="w-full aspect-video bg-teal-faint flex items-center justify-center">
          <Package className="text-teal-primary" size={40} />
        </div>
      ) : (
        <img
          src={listing.image_url ?? ''}
          alt={listing.title}
          className="w-full aspect-video object-cover"
          onError={() => setImgError(true)}
        />
      )}
      <div className="p-4 flex flex-col gap-2">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-faint text-teal-light inline-block self-start">
          {categoryLabel}
        </span>
        <h3 className="text-cream font-bold text-base leading-snug line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-gold font-bold text-xl">R {listing.price}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-cream text-[9px] font-bold flex-shrink-0"
            style={{ backgroundColor: seller.avatar_color }}
          >
            {seller.avatar_initials}
          </span>
          <span className="text-cream-muted text-xs truncate">{seller.full_name}</span>
          {seller.is_verified && <VerifiedBadge />}
          <StarRating rating={seller.avg_rating} size="xs" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-cream-muted text-xs flex items-center gap-1">
            <Users size={12} />
            {listing.contact_count} interested
          </span>
          <ListingCountdown expiresAt={listing.expires_at} />
        </div>
      </div>
    </button>
  );
}
