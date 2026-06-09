import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { currentUser, unreadMessageCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = currentUser
    ? [
        { icon: Home, label: 'Feed', path: '/feed' },
        { icon: PlusCircle, label: 'Post', path: '/post', size: 28 },
        { icon: MessageCircle, label: 'Messages', path: '/chat' },
        { icon: User, label: 'Profile', path: `/profile/${currentUser.id}` },
      ]
    : [
        { icon: Home, label: 'Feed', path: '/feed' },
      ];

  const isActive = (path: string) => {
    if (path === '/chat') return location.pathname.startsWith('/chat');
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-deep border-t border-slate-border z-50 max-w-md mx-auto flex items-center justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 relative"
          >
            <Icon
              size={item.size || 22}
              className={active ? 'text-ember' : 'text-cream-muted'}
            />
            <span className={`text-[10px] ${active ? 'text-ember' : 'text-cream-muted'}`}>
              {item.label}
            </span>
            {item.path === '/chat' && unreadMessageCount > 0 && (
              <span className="absolute -top-1 right-1 w-2.5 h-2.5 bg-status-danger rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
