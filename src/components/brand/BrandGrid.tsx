import BrandCard from './BrandCard';

interface BrandItem {
  slug: string;
  nameHe: string;
  nameEn: string;
  productCount?: number;
}

interface BrandGridProps {
  brands: BrandItem[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {brands.map((brand) => (
        <BrandCard key={brand.slug} {...brand} />
      ))}
    </div>
  );
}
