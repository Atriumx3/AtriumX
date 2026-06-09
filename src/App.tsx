import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import Entrance from './pages/Entrance';
import StudentAuth from './pages/StudentAuth';
import Feed from './pages/Feed';
import ListingDetail from './pages/ListingDetail';
import PostListing from './pages/PostListing';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import RetailerLanding from './pages/RetailerLanding';
import RetailerSignup from './pages/RetailerSignup';
import AdminPanel from './pages/AdminPanel';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/student" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/student" replace />;
  if (!currentUser.is_admin) return <Navigate to="/feed" replace />;
  return <>{children}</>;
}

function ToastContainer() {
  const { toasts } = useApp();
  const iconMap = { success: CheckCircle, error: AlertCircle, info: Info };
  const borderMap = {
    success: 'border-status-success',
    error: 'border-status-danger',
    info: 'border-teal-primary',
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(toast => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`bg-slate-card border border-slate-border rounded-xl px-4 py-3 text-cream text-sm shadow-lg flex items-center gap-2 max-w-sm mx-auto border-l-4 ${borderMap[toast.type]}`}
          >
            <Icon size={16} className="flex-shrink-0" />
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Entrance — always first, no redirect */}
        <Route path="/" element={<Entrance />} />

        {/* Auth */}
        <Route path="/student" element={<StudentAuth />} />

        {/* Public student routes — no sign-in required */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/profile/:userId" element={<Profile />} />

        {/* Protected student routes — sign-in required */}
        <Route path="/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:convId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Retailer routes — public */}
        <Route path="/retailer" element={<RetailerLanding />} />
        <Route path="/retailer/signup" element={<RetailerSignup />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
