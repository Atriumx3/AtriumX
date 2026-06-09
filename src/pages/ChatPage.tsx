import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { getConversationsForUser, getConversationById, getUserById, getListingById, markConversationResolved, submitRating } from '../services/dataService';
import type { MockConversation } from '../services/mock/mockMessages';
import type { MockUser } from '../services/mock/mockUsers';
import type { MockListing } from '../services/mock/mockListings';
import { useApp } from '../context/AppContext';
import ChatList from '../components/student/ChatList';
import ChatWindow from '../components/student/ChatWindow';
import RateSellerModal from '../components/student/RateSellerModal';

export default function ChatPage() {
  const { convId } = useParams<{ convId?: string }>();
  const navigate = useNavigate();
  const { currentUser, showToast } = useApp();
  const [conversations, setConversations] = useState<MockConversation[]>([]);
  const [users, setUsers] = useState<Record<string, MockUser>>({});
  const [listingTitles, setListingTitles] = useState<Record<string, string>>({});
  const [activeConv, setActiveConv] = useState<MockConversation | null>(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getConversationsForUser(currentUser.id).then(async convs => {
      setConversations(convs);
      const ids = new Set<string>();
      convs.forEach(c => { ids.add(c.buyerId); ids.add(c.sellerId); ids.add(c.listingId); });
      const userMap: Record<string, MockUser> = {};
      const listingMap: Record<string, string> = {};
      await Promise.all([
        ...Array.from(ids).map(async id => {
          const u = await getUserById(id);
          if (u) userMap[id] = u;
        }),
        ...convs.map(async c => {
          const l = await getListingById(c.listingId);
          if (l) listingMap[c.listingId] = l.title;
        }),
      ]);
      setUsers(userMap);
      setListingTitles(listingMap);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!convId) { setActiveConv(null); return; }
    getConversationById(convId).then(c => c && setActiveConv(c));
  }, [convId]);

  const handleResolved = async () => {
    if (!activeConv || !currentUser) return;
    const updated = await markConversationResolved(activeConv.id);
    if (updated) {
      setActiveConv(updated);
      showToast('Conversation marked as resolved.', 'success');
    }
  };

  const handleRate = async (stars: number, comment: string) => {
    if (!activeConv || !currentUser) return;
    await submitRating(activeConv.sellerId, stars, activeConv.listingId, currentUser.id);
    setShowRateModal(false);
  };

  const handleClearChat = () => {
    if (!activeConv) return;
    setActiveConv(prev => prev ? { ...prev, messages: [] } : prev);
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, messages: [] } : c));
    setShowClearConfirm(false);
    showToast('Conversation cleared.', 'info');
  };

  if (!currentUser) return null;

  // Conversation list view
  if (!convId) {
    return (
      <div className="min-h-screen bg-slate-deep pb-20">
        <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center justify-center px-4">
          <span className="text-cream font-bold text-lg">Messages</span>
        </div>
        <ChatList
          conversations={conversations}
          currentUserId={currentUser.id}
          users={users}
          listings={listingTitles}
        />
      </div>
    );
  }

  // Conversation detail view
  if (!activeConv) return null;
  const otherId = activeConv.buyerId === currentUser.id ? activeConv.sellerId : activeConv.buyerId;
  const other = users[otherId];
  const isSeller = currentUser.id === activeConv.sellerId;

  return (
    <div className="min-h-screen bg-slate-deep flex flex-col">
      <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center gap-3 px-4">
        <button onClick={() => navigate('/chat')}>
          <ArrowLeft className="text-cream" size={20} />
        </button>
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-cream text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: other?.avatarColor ?? '#1E3A4F' }}
        >
          {other?.avatarInitials ?? '??'}
        </span>
        <span className="text-cream font-bold text-sm">{other?.fullName ?? 'User'}</span>
        <button
          onClick={() => navigate(`/listing/${activeConv.listingId}`)}
          className="text-cream-muted text-xs truncate ml-auto max-w-[120px]"
        >
          {listingTitles[activeConv.listingId] ?? 'Listing'}
        </button>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-status-danger text-xs flex items-center gap-1 ml-2"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {isSeller && !activeConv.isResolved && (
        <div className="px-4 pt-3">
          <button
            onClick={handleResolved}
            className="bg-status-success text-white text-xs font-bold py-1 px-3 rounded-full"
          >
            Mark as Resolved
          </button>
        </div>
      )}

      <div className="flex-1">
        <ChatWindow conversation={activeConv} otherUser={other!} listingTitle={listingTitles[activeConv.listingId] ?? ''} />
      </div>

      {showRateModal && (
        <RateSellerModal
          sellerId={activeConv.sellerId}
          listingId={activeConv.listingId}
          raterId={currentUser.id}
          sellerName={other?.fullName ?? 'Seller'}
          onSkip={() => setShowRateModal(false)}
        />
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setShowClearConfirm(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative bg-slate-card border border-slate-border rounded-2xl p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-cream font-bold text-lg mb-2">Clear this conversation?</h3>
            <p className="text-cream-muted text-sm mb-4">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleClearChat}
                className="flex-1 bg-status-danger text-white rounded-xl py-2 px-4 font-bold text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-transparent border border-slate-border text-cream rounded-xl py-2 px-4 font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
