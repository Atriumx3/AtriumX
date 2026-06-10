import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Profile } from '../services/dataService';
import { getCurrentUser } from '../services/dataService';
import { supabase } from '../services/supabaseClient';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  isStudentSide: boolean;
  setIsStudentSide: (val: boolean) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  unreadMessageCount: number;
  setUnreadMessageCount: (count: number) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (url: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isStudentSide, setIsStudentSide] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    try {
      getCurrentUser().then(user => setCurrentUser(user));

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            getCurrentUser().then(user => setCurrentUser(user));
          } else {
            setCurrentUser(null);
            setUnreadMessageCount(0);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (e) {
      console.error('Auth initialisation failed:', e);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = toastId + 1;
      setToastId(id);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    },
    [toastId]
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isStudentSide,
        setIsStudentSide,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        unreadMessageCount,
        setUnreadMessageCount,
        toasts,
        showToast,
        redirectAfterLogin,
        setRedirectAfterLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
