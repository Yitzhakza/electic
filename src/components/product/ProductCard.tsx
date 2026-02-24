import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { formatPriceDual, calcDiscount } from '@/lib/utils/price';
import { getRelevantCoupons } from '@/lib/aliexpress/general-coupons';
import type { ProductDisplay } from '@/types';

interface ProductCardProps {
  product: ProductDisplay;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { primary, secondary } = formatPriceDual(product.price, product.currency);
  const discount = product.originalPrice ? calcDiscount(product.originalPrice, product.price) : 0;
  const { bestMatch } = getRelevantCoupons(product.price);

  return (
    <Card hover className="overflow-hidden flex flex-col group">
      <Link href={`/p/${product.slug}`} className="block relative aspect-[4/3] bg-surface-alt overflow-hidden">
        {product.images[0]?.startsWith('http') && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        )}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {!discount && product.totalOrders >= 100 && <Badge variant="bestseller">רב מכר</Badge>}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-1.5">
        {product.categoryName && (
          <span className="text-[11px] text-muted font-medium uppercase tracking-wide">{product.categoryName}</span>
        )}

        <Link href={`/p/${product.slug}`} className="hover:text-primary transition-colors">
          <h3 className="text-sm font-semibold line-clamp-2 leading-snug text-text">{product.title}</h3>
        </Link>
        {product.description && (
          <p className="text-xs text-muted line-clamp-1">{product.description}</p>
        )}

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-text">{primary}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {secondary && <span className="text-xs text-muted">{secondary}</span>}
          {bestMatch && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-success font-medium bg-success-light/50 rounded px-2 py-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              קופון {bestMatch.code}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted mt-2">
          {product.rating && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.rating.toFixed(1)}
            </span>
          )}
          {product.totalOrders > 0 && <span>{product.totalOrders.toLocaleString()} הזמנות</span>}
        </div>
      </div>
    </Card>
  );
}
