import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { getListings, getUserById } from '../services/dataService';
import type { MockListing } from '../services/mock/mockListings';
import type { MockUser } from '../services/mock/mockUsers';
import { useApp } from '../context/AppContext';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import CategoryChips from '../components/common/CategoryChips';
import ListingCard from '../components/common/ListingCard';
import EmptyState from '../components/common/EmptyState';

export default function Feed() {
  const { activeCategory, searchQuery, setSearchQuery } = useApp();
  const [listings, setListings] = useState<MockListing[]>([]);
  const [sellers, setSellers] = useState<Record<string, MockUser>>({});

  useEffect(() => {
    getListings().then(async all => {
      const active = all.filter(l => l.status === 'active');
      setListings(active);
      const sellerIds = [...new Set(active.map(l => l.sellerId))];
      const sellerMap: Record<string, MockUser> = {};
      await Promise.all(sellerIds.map(async id => {
        const user = await getUserById(id);
        if (user) sellerMap[id] = user;
      }));
      setSellers(sellerMap);
    });
  }, []);

  const filtered = listings.filter(l => {
    if (activeCategory !== 'all' && l.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-deep pb-20">
      <Navbar />

      <div className="px-4 pt-3 pb-2 relative">
        <Search size={16} className="absolute left-7 top-[18px] text-cream-muted" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search listings..."
          className="w-full bg-slate-card border border-slate-border rounded-xl pl-10 pr-9 py-2 text-cream text-sm placeholder:text-cream-muted focus:outline-none focus:border-teal-light"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-7 top-[14px]">
            <X size={16} className="text-cream-muted" />
          </button>
        )}
      </div>

      <CategoryChips />

      <p className="text-cream-muted text-xs px-4">{filtered.length} listings found</p>

      <div className="px-4 pt-2 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <EmptyState icon="Package" message="Nothing here yet. Be the first to post." actionLabel="Post a Listing" onAction={() => {}} />
        ) : (
          filtered.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              seller={sellers[listing.sellerId] ?? {
                id: 'unknown',
                fullName: 'Unknown',
                avatarInitials: '??',
                avatarColor: '#1E3A4F',
                isVerified: false,
                avgRating: 0,
              }}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
