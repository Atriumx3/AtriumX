export const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'LayoutGrid' },
  { id: 'food', label: 'Late Night Food', icon: 'UtensilsCrossed' },
  { id: 'laundry', label: 'Laundry', icon: 'Shirt' },
  { id: 'textbooks', label: 'Textbooks', icon: 'BookOpen' },
  { id: 'tutoring', label: 'Tutoring', icon: 'GraduationCap' },
  { id: 'electronics', label: 'Electronics', icon: 'Smartphone' },
  { id: 'clothing', label: 'Clothing', icon: 'Shirt' },
  { id: 'transport', label: 'Transport', icon: 'Car' },
  { id: 'other', label: 'Other', icon: 'Package' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
