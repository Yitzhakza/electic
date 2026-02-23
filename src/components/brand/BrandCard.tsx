import Link from 'next/link';
import Card from '@/components/ui/Card';

interface BrandCardProps {
  slug: string;
  nameHe: string;
  nameEn: string;
  productCount?: number;
}

export default function BrandCard({ slug, nameHe, nameEn, productCount }: BrandCardProps) {
  return (
    <Link href={`/brand/${slug}`}>
      <Card hover className="p-6 text-center transition-transform hover:-translate-y-0.5">
        <div className="h-16 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-primary">{nameEn}</span>
        </div>
        <h3 className="font-medium text-lg">{nameHe}</h3>
        {typeof productCount === 'number' && (
          <p className="text-xs text-muted mt-1">{productCount} מוצרים</p>
        )}
      </Card>
    </Link>
  );
}
