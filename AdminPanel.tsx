import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListings, getUserById, reportListing } from '../services/dataService';
import type { MockListing } from '../services/mock/mockListings';
import type { MockUser } from '../services/mock/mockUsers';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/common/StatusBadge';

export default function AdminPanel() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'flagged' | 'all'>('flagged');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [listings, setListings] = useState<MockListing[]>([]);
  const [sellers, setSellers] = useState<Record<string, MockUser>>({});

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) { navigate('/feed'); return; }
    getListings().then(async all => {
      setListings(all);
      const ids = [...new Set(all.map(l => l.sellerId))];
      const map: Record<string, MockUser> = {};
      await Promise.all(ids.map(async id => {
        const u = await getUserById(id);
        if (u) map[id] = u;
      }));
      setSellers(map);
    });
  }, [currentUser, navigate]);

  if (!currentUser?.isAdmin) return null;

  const flagged = listings.filter(l => l.reportCount >= 1).sort((a, b) => b.reportCount - a.reportCount);

  const filtered = statusFilter === 'all' ? listings : listings.filter(l => l.status === statusFilter);

  const handleSuspend = async (id: string) => {
    await reportListing(id);
    const updated = await getListings();
    setListings(updated);
  };

  const handleClear = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, reportCount: 0 } : l));
  };

  const ListingRow = ({ listing }: { listing: MockListing }) => {
    const seller = sellers[listing.sellerId];
    return (
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-border">
        <div className="flex-1 min-w-0">
          <p className="text-cream text-sm font-bold truncate">{listing.title}</p>
          <p className="text-cream-muted text-xs">{seller?.fullName ?? 'Unknown'}</p>
        </div>
        {listing.reportCount > 0 && (
          <span className="bg-status-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {listing.reportCount} reports
          </span>
        )}
        <StatusBadge status={listing.status} />
        <div className="flex gap-2 flex-shrink-0">
          {listing.status !== 'suspended' && (
            <button onClick={() => handleSuspend(listing.id)} className="bg-status-danger text-white text-xs font-bold py-1 px-2 rounded-lg">
              Suspend
            </button>
          )}
          {listing.reportCount > 0 && (
            <button onClick={() => handleClear(listing.id)} className="bg-teal-primary text-cream text-xs font-bold py-1 px-2 rounded-lg">
              Clear
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-deep">
      <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center justify-center px-4">
        <span className="text-cream font-bold text-lg">Admin Panel</span>
      </div>

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('flagged')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === 'flagged' ? 'bg-ember text-white' : 'bg-slate-card text-cream-muted border border-slate-border'
            }`}
          >
            Flagged Listings
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === 'all' ? 'bg-ember text-white' : 'bg-slate-card text-cream-muted border border-slate-border'
            }`}
          >
            All Listings
          </button>
        </div>

        {tab === 'flagged' && (
          <div>
            {flagged.length === 0 ? (
              <p className="text-cream-muted text-sm text-center py-8">No flagged listings.</p>
            ) : (
              flagged.map(l => <ListingRow key={l.id} listing={l} />)
            )}
          </div>
        )}

        {tab === 'all' && (
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {['all', 'active', 'sold', 'suspended', 'expired'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${
                    statusFilter === s ? 'bg-teal-primary text-cream' : 'bg-slate-card text-cream-muted border border-slate-border'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {filtered.map(l => <ListingRow key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
