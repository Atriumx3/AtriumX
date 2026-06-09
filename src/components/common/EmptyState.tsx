import {
  LayoutGrid, UtensilsCrossed, WashingMachine, BookOpen,
  GraduationCap, Smartphone, Shirt, Car, Package,
  MessageCircle, Search,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutGrid, UtensilsCrossed, WashingMachine, BookOpen,
  GraduationCap, Smartphone, Shirt, Car, Package,
  MessageCircle, Search,
};

interface EmptyStateProps {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = 'Package', message, actionLabel, onAction }: EmptyStateProps) {
  const Icon = ICON_MAP[icon] ?? Package;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-8">
      <Icon size={48} className="text-teal-primary opacity-40" />
      <p className="text-cream-muted text-sm">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-teal-light underline text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
