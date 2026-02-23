type Variant = 'default' | 'sale' | 'coupon' | 'brand' | 'category';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  sale: 'bg-red-100 text-red-700',
  coupon: 'bg-green-100 text-green-700',
  brand: 'bg-blue-100 text-blue-700',
  category: 'bg-purple-100 text-purple-700',
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
