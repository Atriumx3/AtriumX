import { useNavigate } from 'react-router-dom';

export default function RetailerNavbar() {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-slate-deep border-b border-slate-border px-4 h-14 flex items-center justify-between">
      <span className="text-gold font-bold text-lg">CN</span>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-cream-muted text-sm">
          For Students
        </button>
        <button
          onClick={() => navigate('/retailer/signup')}
          className="bg-ember text-white font-bold text-sm rounded-xl px-4 py-2"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
