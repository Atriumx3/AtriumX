interface PlanSelectorProps {
  onSelect: (plan: string) => void;
}

const plans = [
  {
    name: 'ghost',
    label: 'GHOST',
    price: 'Free',
    tagline: 'Your listing exists. Nobody will notice it.',
    details: 'No photo. No chat. 3 days.',
    cta: 'Post for Free',
  },
  {
    name: 'visible',
    label: 'VISIBLE',
    price: 'R29/month',
    tagline: 'Students can see you. Now make it count.',
    details: 'Photo included. Chat unlocked. 7 days.',
    cta: 'Choose Visible',
  },
  {
    name: 'loud',
    label: 'LOUD',
    price: 'R79/month',
    tagline: 'You show up before everyone else.',
    details: 'Priority placement. 14 days.',
    cta: 'Choose Loud',
  },
  {
    name: 'unmissable',
    label: 'UNMISSABLE',
    price: 'R149/month',
    tagline: 'First in the feed. Every single day.',
    details: 'Video upload. Pinned. 30 days.',
    cta: 'Choose Unmissable',
  },
];

export default function PlanSelector({ onSelect }: PlanSelectorProps) {
  return (
    <div className="px-4 pt-4 pb-28 max-w-md mx-auto">
      <h1 className="text-cream font-bold text-2xl font-serif">Choose a Plan</h1>
      <p className="text-cream-muted text-sm mt-1">Select how you want your listing to appear.</p>
      <div className="flex flex-col gap-4 mt-6">
        {plans.map(plan => (
          <div key={plan.name} className="bg-slate-card border border-slate-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-cream font-bold text-base">{plan.label}</span>
              <span className="text-gold font-bold text-sm">{plan.price}</span>
            </div>
            <p className="text-cream-muted text-sm">{plan.tagline}</p>
            <p className="text-cream-muted text-xs mt-1">{plan.details}</p>
            <button
              onClick={() => onSelect(plan.name)}
              className="bg-ember text-white rounded-xl py-3 px-6 font-bold text-sm w-full mt-4"
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
