import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Package, Users } from 'lucide-react';
import { getListingById, getUserById, markListingAsSold, renewListing, reportListing, startConversation, getConversationsForUser, sendMessage } from '../services/dataService';
import type { Listing, Profile } from '../services/dataService';
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
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [imgError, setImgError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBuyerSelect, setShowBuyerSelect] = useState(false);
  const [buyerCandidates, setBuyerCandidates] = useState<Profile[]>([]);

  useEffect(() => {
    if (!id) return;
    getListingById(id).then(l => {
      if (!l) return;
      setListing(l);
      getUserById(l.seller_id).then(s => s && setSeller(s));
    });
  }, [id]);

  if (!listing || !seller) return <div className="min-h-screen bg-slate-deep" />;

  const isSeller = currentUser?.id === listing.seller_id;
  const categoryLabel = CATEGORIES.find(c => c.id === listing.category)?.label ?? listing.category;
  const joinDate = new Date(seller.joined_date).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

  const handleMarkSold = async () => {
    const convs = await getConversationsForUser(listing.seller_id);
    const listingConvs = convs.filter(c => c.listing_id === listing.id);
    const buyerIds = [...new Set(listingConvs.map(c => c.buyer_id))];
    const buyers: Profile[] = [];
    await Promise.all(buyerIds.map(async id => {
      const u = await getUserById(id);
      if (u) buyers.push(u);
    }));
    setBuyerCandidates(buyers);
    setShowBuyerSelect(true);
  };

  const confirmMarkSold = async (buyerId: string | null) => {
    const updated = await markListingAsSold(listing.id);
    if (updated) {
      setListing(updated);
      showToast('Listing marked as sold.', 'success');
    }
    if (buyerId && currentUser) {
      const convs = await getConversationsForUser(listing.seller_id);
      const conv = convs.find(c => c.listing_id === listing.id && c.buyer_id === buyerId);
      if (conv) {
        await sendMessage(conv.id, 'system', `Hi! You recently bought from ${seller.full_name}. How was your experience? Tap below to leave a rating.`);
      }
    }
    setShowBuyerSelect(false);
  };

  const handleMarkFulfilled = async () => {
    const updated = await renewListing(listing.id);
    if (updated) { setListing(updated); showToast('Listing fulfilled and renewed for 7 days.', 'success'); }
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
            src={listing.image_url ?? ''}
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
          <ListingCountdown expiresAt={listing.expires_at} />

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
                style={{ backgroundColor: seller.avatar_color }}
              >
                {seller.avatar_initials}
              </span>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-cream font-bold">{seller.full_name}</span>
                  {seller.is_verified && <VerifiedBadge />}
                </div>
                <p className="text-cream-muted text-xs">{seller.total_ratings} ratings · Joined {joinDate}</p>
                <StarRating rating={seller.avg_rating} size="sm" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-cream-muted text-xs flex items-center gap-1">
              <Users size={12} /> Contacted {listing.contact_count} times
            </span>
            <span className="text-cream-muted text-xs">
              Posted {new Date(listing.created_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-deep border-t border-slate-border px-4 py-3 max-w-md mx-auto z-40">
        {isSeller ? (
          <div className="flex gap-3">
            {listing.listing_type === 'single' ? (
              <button
                onClick={handleMarkSold}
                className="flex-1 bg-transparent border border-slate-border text-cream rounded-xl py-3 font-bold text-base"
              >
                Mark as Sold
              </button>
            ) : (
              <button
                onClick={handleMarkFulfilled}
                className="flex-1 bg-transparent border border-slate-border text-cream rounded-xl py-3 font-bold text-base"
              >
                Mark as Fulfilled
              </button>
            )}
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

      {showBuyerSelect && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => confirmMarkSold(null)}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative bg-slate-card border border-slate-border rounded-2xl p-6 max-w-sm mx-4 w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-cream font-bold text-lg mb-4">Who bought this?</h3>
            {buyerCandidates.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {buyerCandidates.map(buyer => (
                  <button
                    key={buyer.id}
                    onClick={() => confirmMarkSold(buyer.id)}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-deep border border-slate-border rounded-xl text-left"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-cream text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: buyer.avatar_color }}
                    >
                      {buyer.avatar_initials}
                    </span>
                    <span className="text-cream text-sm font-bold">{buyer.full_name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-cream-muted text-sm mb-4">No one has messaged about this listing yet.</p>
            )}
            <button
              onClick={() => confirmMarkSold(null)}
              className="text-teal-light underline text-sm w-full text-center mt-4 block"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
