import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { MockUser } from '../services/mock/mockUsers';
import { getCurrentUser } from '../services/dataService';
import { MOCK_CONVERSATIONS } from '../services/mock/mockMessages';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: MockUser | null;
  setCurrentUser: (user: MockUser | null) => void;
  isStudentSide: boolean;
  setIsStudentSide: (val: boolean) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  unreadMessageCount: number;
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
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isStudentSide, setIsStudentSide] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  const unreadMessageCount = MOCK_CONVERSATIONS.reduce((count, conv) => {
    return count + conv.messages.filter(m => !m.read && m.senderId !== (currentUser?.id ?? '')).length;
  }, 0);

  useEffect(() => {
    getCurrentUser().then(user => setCurrentUser(user));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = toastId + 1;
    setToastId(id);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, [toastId]);

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
