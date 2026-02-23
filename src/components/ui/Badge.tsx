type Variant = 'default' | 'sale' | 'coupon' | 'brand' | 'category';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  sale: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
  coupon: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  brand: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  category: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
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
