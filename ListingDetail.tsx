import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Package, Users } from 'lucide-react';
import { getListingById, getUserById, markListingAsSold, renewListing, reportListing, startConversation } from '../services/dataService';
import type { MockListing } from '../services/mock/mockListings';
import type { MockUser } from '../services/mock/mockUsers';
import { CATEGORIES } from '../services/mock/mockCategories';
import { useApp } from '../context/AppContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import StarRating from '../components/common/StarRating';
import ListingCountdown from '../components/student/ListingCountdown';
import ReportModal from '../components/student/ReportModal';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, showToast } = useApp();
  const [listing, setListing] = useState<MockListing | null>(null);
  const [seller, setSeller] = useState<MockUser | null>(null);
  const [imgError, setImgError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    getListingById(id).then(l => {
      if (!l) return;
      setListing(l);
      getUserById(l.sellerId).then(s => s && setSeller(s));
    });
  }, [id]);

  if (!listing || !seller) return <div className="min-h-screen bg-slate-deep" />;

  const isSeller = currentUser?.id === listing.sellerId;
  const categoryLabel = CATEGORIES.find(c => c.id === listing.category)?.label ?? listing.category;
  const joinDate = new Date(seller.joinedDate).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

  const handleMarkSold = async () => {
    const updated = await markListingAsSold(listing.id);
    if (updated) { setListing(updated); showToast('Listing marked as sold.', 'success'); }
  };

  const handleRenew = async () => {
    const updated = await renewListing(listing.id);
    if (updated) { setListing(updated); showToast('Listing renewed for 7 days.', 'success'); }
  };

  const handleReport = async () => {
    const updated = await reportListing(listing.id);
    if (updated) setListing(updated);
    setShowReport(false);
    showToast('Report submitted. Thank you.', 'success');
  };

  const handleInterested = async () => {
    if (!currentUser) {
      localStorage.setItem('pendingListingId', listing.id);
      navigate('/student');
      return;
    }
    const conv = await startConversation(listing.id, currentUser.id);
    navigate(`/chat/${conv.id}`);
  };

  const statusBanner = () => {
    if (listing.status === 'sold') return <div className="bg-status-success text-white text-center py-2 text-sm font-bold">This item has been sold</div>;
    if (listing.status === 'suspended') return <div className="bg-status-danger text-white text-center py-2 text-sm font-bold">This listing has been suspended.</div>;
    if (listing.status === 'expired') return <div className="bg-status-warning text-slate-deep text-center py-2 text-sm font-bold">This listing has expired.</div>;
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-deep">
      <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center justify-between px-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-cream" size={20} />
        </button>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical className="text-cream" size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-slate-card border border-slate-border rounded-xl shadow-lg py-1 w-44 z-50">
              <button
                onClick={() => { setShowMenu(false); setShowReport(true); }}
                className="w-full text-left px-4 py-2 text-status-danger text-sm hover:bg-slate-deep"
              >
                Report this listing
              </button>
            </div>
          )}
        </div>
      </div>

      {statusBanner()}

      <div className="pb-28">
        {imgError ? (
          <div className="w-full aspect-video bg-teal-faint flex items-center justify-center">
            <Package className="text-teal-primary" size={48} />
          </div>
        ) : (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full aspect-video object-cover"
            onError={() => setImgError(true)}
          />
        )}

        <div className="px-4 pt-4 flex flex-col gap-4">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-faint text-teal-light inline-block self-start">
            {categoryLabel}
          </span>
          <h1 className="text-cream font-bold text-2xl font-serif">{listing.title}</h1>
          <p className="text-gold font-bold text-3xl">R {listing.price}</p>
          <ListingCountdown expiresAt={listing.expiresAt} />

          <hr className="border-slate-border" />
          <p className="text-cream text-sm leading-relaxed">{listing.description}</p>
          <hr className="border-slate-border" />

          <div>
            <p className="text-cream-muted text-xs font-bold uppercase tracking-wide">About the Seller</p>
            <button
              onClick={() => navigate(`/profile/${seller.id}`)}
              className="flex items-center gap-3 mt-2 text-left"
            >
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-cream text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: seller.avatarColor }}
              >
                {seller.avatarInitials}
              </span>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-cream font-bold">{seller.fullName}</span>
                  {seller.isVerified && <VerifiedBadge />}
                </div>
                <p className="text-cream-muted text-xs">{seller.totalRatings} ratings · Joined {joinDate}</p>
                <StarRating rating={seller.avgRating} size="sm" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-cream-muted text-xs flex items-center gap-1">
              <Users size={12} /> Contacted {listing.contactCount} times
            </span>
            <span className="text-cream-muted text-xs">
              Posted {new Date(listing.createdAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-deep border-t border-slate-border px-4 py-3 max-w-md mx-auto z-40">
        {isSeller ? (
          <div className="flex gap-3">
            <button
              onClick={handleMarkSold}
              className="flex-1 bg-transparent border border-slate-border text-cream rounded-xl py-3 font-bold text-base"
            >
              Mark as Sold
            </button>
            <button
              onClick={handleRenew}
              className="flex-1 bg-ember text-white rounded-xl py-3 font-bold text-base"
            >
              Renew Listing
            </button>
          </div>
        ) : listing.status === 'active' ? (
          <button
            onClick={handleInterested}
            className="bg-ember text-white rounded-xl py-3 font-bold text-base w-full"
          >
            I'm Interested — Message Seller
          </button>
        ) : (
          <button disabled className="bg-ember text-white rounded-xl py-3 font-bold text-base w-full opacity-40 cursor-not-allowed">
            Listing Unavailable
          </button>
        )}
      </div>

      {showReport && (
        <ReportModal onConfirm={handleReport} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}
