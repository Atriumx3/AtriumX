interface StatusBadgeProps {
  status: 'active' | 'sold' | 'suspended' | 'expired' | 'pending';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-status-success text-white' },
  sold: { label: 'Sold', className: 'bg-teal-primary text-cream' },
  suspended: { label: 'Suspended', className: 'bg-status-danger text-white' },
  expired: { label: 'Expired', className: 'bg-status-warning text-slate-deep' },
  pending: { label: 'Pending', className: 'bg-status-warning text-slate-deep' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
