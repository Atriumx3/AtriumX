import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { currentUser, unreadMessageCount } = useApp();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border h-14 flex items-center justify-between px-4">
      <span className="text-gold font-bold text-lg">AX</span>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell className="text-cream-muted" size={20} />
          {unreadMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-status-danger rounded-full" />
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
