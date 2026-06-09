import {
  LayoutGrid, UtensilsCrossed, WashingMachine, BookOpen,
  GraduationCap, Smartphone, Shirt, Car, Package,
} from 'lucide-react';
import { CATEGORIES } from '../../services/mock/mockCategories';
import { useApp } from '../../context/AppContext';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutGrid,
  UtensilsCrossed,
  WashingMachine,
  BookOpen,
  GraduationCap,
  Smartphone,
  Shirt,
  Car,
  Package,
};

export default function CategoryChips() {
  const { activeCategory, setActiveCategory } = useApp();

  return (
    <div className="overflow-x-auto whitespace-nowrap px-4 py-2 scrollbar-hide">
      {CATEGORIES.map(cat => {
        const Icon = ICON_MAP[cat.icon];
        const active = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mr-2 ${
              active
                ? 'bg-teal-primary text-cream border border-teal-light'
                : 'bg-slate-card border border-slate-border text-cream-muted'
            }`}
          >
            {Icon && <Icon size={14} />}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
