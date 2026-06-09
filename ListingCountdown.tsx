interface ListingCountdownProps {
  expiresAt: string;
}

export default function ListingCountdown({ expiresAt }: ListingCountdownProps) {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) {
    return <span className="text-status-danger text-xs">Expired</span>;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 2) {
    return <span className="text-cream-muted text-xs">Expires in {days} days</span>;
  }

  return <span className="text-status-warning text-xs">Expires in {hours}h</span>;
}
