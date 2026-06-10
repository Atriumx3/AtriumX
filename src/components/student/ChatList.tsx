import { useNavigate } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';
import type { Conversation, Profile } from '../../services/dataService';

interface ChatListProps {
  conversations: Conversation[];
  currentUserId: string;
  users: Record<string, Profile>;
  listings: Record<string, { title: string }>;
}

export default function ChatList({ conversations, currentUserId, users, listings }: ChatListProps) {
  const navigate = useNavigate();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-8">
        <span className="text-cream-muted text-sm">No messages yet. Find a listing and tap "I'm Interested".</span>
      </div>
    );
  }

  return (
    <div>
      {conversations.map(conv => {
        const otherId = conv.buyer_id === currentUserId ? conv.seller_id : conv.buyer_id;
        const other = users[otherId];
        const listing = listings[conv.listing_id];
        const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
        const hasUnread = conv.messages ? conv.messages.some(m => !m.read && m.sender_id !== currentUserId) : false;

        return (
          <button
            key={conv.id}
            onClick={() => navigate(`/chat/${conv.id}`)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-b border-slate-border cursor-pointer text-left ${
              hasUnread ? 'bg-teal-faint' : ''
            }`}
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-cream text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: other?.avatar_color ?? '#1E3A4F' }}
            >
              {other?.avatar_initials ?? '??'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-cream text-sm font-bold truncate">{listing?.title ?? 'Listing'}</p>
              <p className="text-cream-muted text-xs truncate">{lastMsg?.content ?? 'No messages'}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {lastMsg && (
                <span className="text-cream-muted text-xs">
                  {new Date(lastMsg.sent_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                </span>
              )}
              {conv.is_resolved && <CheckCheck size={14} className="text-status-success" />}
              {hasUnread && <span className="w-2.5 h-2.5 bg-ember rounded-full" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
