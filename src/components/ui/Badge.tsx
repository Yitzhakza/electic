type Variant = 'default' | 'sale' | 'coupon' | 'brand' | 'category' | 'bestseller' | 'new';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-stone-100 text-stone-700',
  sale: 'bg-red-600 text-white font-semibold',
  coupon: 'bg-success text-white font-semibold',
  brand: 'bg-primary/8 text-primary border border-primary/15',
  category: 'bg-accent/8 text-accent-dark border border-accent/15',
  bestseller: 'bg-amber-500 text-white font-semibold',
  new: 'bg-primary text-white font-semibold',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
