import { useNavigate } from 'react-router-dom';
import { GraduationCap, Store } from 'lucide-react';

export default function Entrance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-deep flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-3xl">
          <span className="text-cream font-sans font-medium">Campus</span>{' '}
          <span className="text-gold font-bold">Noticeboard</span>
        </h1>
        <p className="text-cream-muted text-sm mt-2">The residence economy, organised.</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="bg-slate-card border border-slate-border rounded-2xl p-6">
          <GraduationCap className="text-teal-primary" size={32} />
          <h2 className="text-cream text-xl font-bold mt-3">I'm a Student</h2>
          <p className="text-cream-muted text-sm mt-1">Browse listings and buy from your neighbours.</p>
          <button
            onClick={() => navigate('/student')}
            className="bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full mt-4"
          >
            Enter the Marketplace
          </button>
        </div>

        <div className="bg-teal-primary border border-teal-light rounded-2xl p-6">
          <Store className="text-gold" size={32} />
          <h2 className="text-cream text-xl font-bold mt-3">I'm a Business</h2>
          <p className="text-cream-muted text-sm mt-1">Reach hundreds of students in one residence.</p>
          <button
            onClick={() => navigate('/retailer')}
            className="bg-gold text-slate-deep font-bold rounded-xl py-3 w-full mt-4"
          >
            Advertise With Us
          </button>
        </div>
      </div>

      <p className="text-cream-muted text-xs text-center">
        Open to all students. Free to join.
      </p>
    </div>
  );
}
