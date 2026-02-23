import Link from 'next/link';
import Card from '@/components/ui/Card';

interface BrandCardProps {
  slug: string;
  nameHe: string;
  nameEn: string;
  productCount?: number;
}

const brandColors: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
  tesla: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-t-red-500', shadow: 'hover:shadow-red-200/50' },
  byd: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-t-green-500', shadow: 'hover:shadow-green-200/50' },
  mg: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-t-orange-500', shadow: 'hover:shadow-orange-200/50' },
  nio: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-t-blue-500', shadow: 'hover:shadow-blue-200/50' },
  xpeng: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-t-cyan-500', shadow: 'hover:shadow-cyan-200/50' },
  skywell: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-t-purple-500', shadow: 'hover:shadow-purple-200/50' },
  zeekr: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-t-indigo-500', shadow: 'hover:shadow-indigo-200/50' },
  geely: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-t-teal-500', shadow: 'hover:shadow-teal-200/50' },
};

const defaultColors = { bg: 'bg-primary/5', text: 'text-primary', border: 'border-t-primary', shadow: 'hover:shadow-primary/20' };

export default function BrandCard({ slug, nameHe, nameEn, productCount }: BrandCardProps) {
  const colors = brandColors[slug] ?? defaultColors;

  return (
    <Link href={`/brand/${slug}`}>
      <Card hover className={`p-6 text-center border-t-4 ${colors.border} ${colors.shadow} hover:shadow-lg`}>
        <div className={`h-14 w-14 mx-auto mb-3 rounded-full ${colors.bg} flex items-center justify-center`}>
          <span className={`text-xl font-bold ${colors.text}`}>{nameEn.charAt(0)}</span>
        </div>
        <h3 className="font-semibold text-lg">{nameHe}</h3>
        <p className={`text-sm ${colors.text} font-medium mt-0.5`}>{nameEn}</p>
        {typeof productCount === 'number' && (
          <p className="text-xs text-muted mt-2">{productCount} מוצרים</p>
        )}
      </Card>
    </Link>
  );
}
