import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getUserById, getUserListings, getListingById } from '../services/dataService';
import type { MockUser } from '../services/mock/mockUsers';
import type { MockListing } from '../services/mock/mockListings';
import { useApp } from '../context/AppContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import StarRating from '../components/common/StarRating';
import ListingCard from '../components/common/ListingCard';
import EmptyState from '../components/common/EmptyState';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [user, setUser] = useState<MockUser | null>(null);
  const [listings, setListings] = useState<MockListing[]>([]);
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getUserById(userId).then(u => u && setUser(u));
    getUserListings(userId).then(setListings);
  }, [userId]);

  if (!user) return <div className="min-h-screen bg-slate-deep" />;

  const isOwnProfile = currentUser?.id === user.id;
  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');
  const joinDate = new Date(user.joinedDate).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-deep pb-20">
      <div className="px-4 pt-6 pb-4 border-b border-slate-border">
        <div className="flex items-center gap-3">
          <span
            className="w-16 h-16 rounded-full flex items-center justify-center text-cream text-xl font-bold"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.avatarInitials}
          </span>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-cream font-bold text-xl">{user.fullName}</span>
              {user.isVerified && <VerifiedBadge />}
            </div>
            <p className="text-cream-muted text-sm">{user.campus} · {user.residence}</p>
            <p className="text-cream-muted text-xs mt-1">
              {user.totalListings} listings · {user.totalRatings} ratings · Joined {joinDate}
            </p>
            <div className="mt-1">
              <StarRating rating={user.avgRating} size="sm" />
              <span className="text-cream-muted text-xs ml-1">{user.avgRating.toFixed(1)} ({user.totalRatings} ratings)</span>
            </div>
          </div>
        </div>
        {isOwnProfile && (
          <button className="mt-4 bg-transparent border border-slate-border text-cream rounded-xl py-3 px-6 font-bold text-base w-full">
            Edit Profile
          </button>
        )}
      </div>

      <div className="px-4 pt-4">
        <h2 className="text-cream font-bold text-base mb-3">Active Listings</h2>
        {activeListings.length === 0 ? (
          <EmptyState icon="Package" message="No active listings." />
        ) : (
          <div className="flex flex-col gap-4">
            {activeListings.map(l => (
              <ListingCardWrapper key={l.id} listing={l} />
            ))}
          </div>
        )}

        {soldListings.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowSold(!showSold)}
              className="flex items-center gap-2 text-cream-muted text-sm mb-3"
            >
              {showSold ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {soldListings.length} Sold Items
            </button>
            {showSold && (
              <div className="flex flex-col gap-4 opacity-60">
                {soldListings.map(l => (
                  <ListingCardWrapper key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCardWrapper({ listing }: { listing: MockListing }) {
  const [seller, setSeller] = useState<MockUser | null>(null);
  useEffect(() => {
    getUserById(listing.sellerId).then(u => u && setSeller(u));
  }, [listing.sellerId]);

  if (!seller) return null;
  return <ListingCard listing={listing} seller={seller} />;
}
