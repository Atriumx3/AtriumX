import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllListingsAdmin, getUserById, updateListingStatus, clearReports, approveListingById, rejectListingById } from '../services/dataService';
import type { Listing, Profile } from '../services/dataService';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';

export default function AdminPanel() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'flagged' | 'all' | 'pending'>('flagged');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [listings, setListings] = useState<Listing[]>([]);
  const [sellers, setSellers] = useState<Record<string, Profile>>({});

  useEffect(() => {
    if (currentUser && !currentUser.is_admin) { navigate('/feed'); return; }
    getAllListingsAdmin().then(async all => {
      setListings(all);
      const ids = [...new Set(all.map(l => l.seller_id))];
      const map: Record<string, Profile> = {};
      await Promise.all(ids.map(async id => {
        const u = await getUserById(id);
        if (u) map[id] = u;
      }));
      setSellers(map);
    });
  }, [currentUser, navigate]);

  if (!currentUser?.is_admin) return null;

  const flagged = listings.filter(l => l.report_count >= 1).sort((a, b) => b.report_count - a.report_count);

  const filtered = statusFilter === 'all' ? listings : listings.filter(l => l.status === statusFilter);

  const handleSuspend = async (id: string) => {
    await updateListingStatus(id, 'suspended');
    const updated = await getAllListingsAdmin();
    setListings(updated);
  };

  const handleClear = async (id: string) => {
    await clearReports(id);
    const updated = await getAllListingsAdmin();
    setListings(updated);
  };

  const handleApprove = async (id: string) => {
    await approveListingById(id);
    const updated = await getAllListingsAdmin();
    setListings(updated);
  };

  const handleReject = async (id: string) => {
    await rejectListingById(id);
    const updated = await getAllListingsAdmin();
    setListings(updated);
  };

  const ListingRow = ({ listing }: { listing: Listing }) => {
    const seller = sellers[listing.seller_id];
    return (
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-border">
        <div className="flex-1 min-w-0">
          <p className="text-cream text-sm font-bold truncate">{listing.title}</p>
          <p className="text-cream-muted text-xs">{seller?.full_name ?? 'Unknown'}</p>
        </div>
        {listing.report_count > 0 && (
          <span className="bg-status-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {listing.report_count} reports
          </span>
        )}
        <StatusBadge status={listing.status} />
        <div className="flex gap-2 flex-shrink-0">
          {listing.status !== 'suspended' && (
            <button onClick={() => handleSuspend(listing.id)} className="bg-status-danger text-white text-xs font-bold py-1 px-2 rounded-lg">
              Suspend
            </button>
          )}
          {listing.report_count > 0 && (
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
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              tab === 'pending' ? 'bg-ember text-white' : 'bg-slate-card text-cream-muted border border-slate-border'
            }`}
          >
            Pending Approval
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
              {['all', 'active', 'sold', 'suspended', 'expired', 'pending'].map(s => (
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

        {tab === 'pending' && (
          <div>
            {listings.filter(l => l.status === 'pending').length === 0 ? (
              <EmptyState icon="Package" message="No listings awaiting approval." />
            ) : (
              listings.filter(l => l.status === 'pending').map(l => {
                const seller = sellers[l.seller_id];
                const catLabel = l.category === 'other' && l.custom_category ? l.custom_category : l.category;
                return (
                  <div key={l.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm font-bold truncate">{l.title}</p>
                      <p className="text-cream-muted text-xs">{seller?.full_name ?? 'Unknown'} · {catLabel} · {l.listing_type === 'single' ? 'Single' : 'Ongoing'}</p>
                      <p className="text-cream-muted text-xs">Submitted {new Date(l.created_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleApprove(l.id)} className="bg-status-success text-white text-xs font-bold py-1 px-3 rounded-full">
                        Approve
                      </button>
                      <button onClick={() => handleReject(l.id)} className="bg-status-danger text-white text-xs font-bold py-1 px-3 rounded-full">
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
