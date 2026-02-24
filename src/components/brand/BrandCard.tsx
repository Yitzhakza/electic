import Link from 'next/link';

interface BrandCardProps {
  slug: string;
  nameHe: string;
  nameEn: string;
  productCount?: number;
}

const brandColors: Record<string, { bg: string; text: string }> = {
  tesla: { bg: 'bg-red-50', text: 'text-red-600' },
  byd: { bg: 'bg-green-50', text: 'text-green-600' },
  mg: { bg: 'bg-orange-50', text: 'text-orange-600' },
  nio: { bg: 'bg-blue-50', text: 'text-blue-600' },
  xpeng: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  skywell: { bg: 'bg-purple-50', text: 'text-purple-600' },
  zeekr: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  geely: { bg: 'bg-teal-50', text: 'text-teal-600' },
};

const defaultColors = { bg: 'bg-accent/5', text: 'text-accent' };

export default function BrandCard({ slug, nameHe, nameEn, productCount }: BrandCardProps) {
  const colors = brandColors[slug] ?? defaultColors;

  return (
    <Link href={`/brand/${slug}`}>
      <div className="bg-white rounded-xl border border-border/40 hover:border-accent/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 p-6 text-center">
        <div className={`h-14 w-14 mx-auto mb-3 rounded-full ${colors.bg} flex items-center justify-center`}>
          <span className={`text-xl font-bold ${colors.text}`}>{nameEn.charAt(0)}</span>
        </div>
        <h3 className="font-semibold text-lg text-text">{nameHe}</h3>
        <p className={`text-sm ${colors.text} font-medium mt-0.5`}>{nameEn}</p>
        {typeof productCount === 'number' && (
          <p className="text-xs text-muted mt-2">{productCount} מוצרים</p>
        )}
      </div>
    </Link>
  );
}
