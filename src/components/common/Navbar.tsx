import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getUnreadNotifications, markNotificationRead } from '../../services/dataService';
import { supabase } from '../../services/supabaseClient';

interface NotificationItem {
  id: string;
  message: string;
  type: string;
  listing_id: string | null;
  conversation_id: string | null;
}

export default function Navbar() {
  const { currentUser, unreadMessageCount } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    getUnreadNotifications(currentUser.id).then(setNotifications);

    if (!supabase) return;
    const channel = supabase
      .channel('notifications:' + currentUser.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: 'user_id=eq.' + currentUser.id,
      }, (payload) => {
        setNotifications(prev => [payload.new as NotificationItem, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser]);

  useEffect(() => {
    if (!showPanel) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPanel]);

  const handleNotificationClick = async (n: NotificationItem) => {
    await markNotificationRead(n.id);
    setNotifications(prev => prev.filter(item => item.id !== n.id));
    if (n.listing_id) navigate(`/listing/${n.listing_id}`);
    else if (n.conversation_id) navigate(`/chat/${n.conversation_id}`);
    setShowPanel(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center justify-between px-4">
      <span className="text-gold font-bold text-lg">AX</span>
      <div className="flex items-center gap-3">
        <div className="relative" ref={panelRef}>
          <button onClick={() => setShowPanel(!showPanel)} className="relative">
            <Bell className="text-cream-muted" size={20} />
            {(unreadMessageCount > 0 || notifications.length > 0) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-status-danger rounded-full" />
            )}
          </button>
          {showPanel && (
            <div className="absolute right-0 top-10 bg-slate-card border border-slate-border rounded-xl shadow-lg w-72 max-h-64 overflow-y-auto z-50">
              {notifications.length === 0 ? (
                <p className="text-cream-muted text-sm p-4 text-center">No new notifications.</p>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="w-full text-left px-4 py-3 border-b border-slate-border last:border-b-0 hover:bg-slate-deep"
                  >
                    <p className="text-cream text-sm">{n.message}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {currentUser && (
          <button
            onClick={() => navigate(`/profile/${currentUser.id}`)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cream text-xs font-bold"
            style={{ backgroundColor: currentUser.avatar_color }}
          >
            {currentUser.avatar_initials}
          </button>
        )}
      </div>
    </div>
  );
}
