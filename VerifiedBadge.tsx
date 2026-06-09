import { BadgeCheck } from 'lucide-react';

export default function VerifiedBadge() {
  return (
    <span className="relative group" title="Verified Wits student">
      <BadgeCheck className="text-teal-light" size={14} />
    </span>
  );
}
