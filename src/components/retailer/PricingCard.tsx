import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingCardProps {
  tier: string;
  price: string;
  period: string;
  features: string[];
  isHighlighted?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
}

export default function PricingCard({ tier, price, period, features, isHighlighted, ctaLabel, ctaUrl }: PricingCardProps) {
  const navigate = useNavigate();

  const buttonLabel = ctaLabel ?? `Choose ${tier}`;
  const targetUrl = ctaUrl ?? `/retailer/signup?tier=${encodeURIComponent(tier)}`;

  return (
    <div
      className={`rounded-2xl p-6 mb-4 ${
        isHighlighted
          ? 'bg-slate-deep border-2 border-gold'
          : 'bg-slate-card border border-slate-border'
      }`}
    >
      <h3 className="text-cream font-bold text-lg">{tier}</h3>
      <div className="mt-2">
        <span className="text-gold font-bold text-3xl">{price}</span>
        <span className="text-cream-muted text-sm ml-1">{period}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle size={16} className="text-status-success flex-shrink-0 mt-0.5" />
            <span className="text-cream text-sm">{feat}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate(targetUrl)}
        className="bg-ember text-white rounded-xl py-3 px-6 font-bold text-base w-full mt-6"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
