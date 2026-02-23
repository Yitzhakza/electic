import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { formatPriceDual, calcDiscount } from '@/lib/utils/price';
import type { ProductDisplay } from '@/types';

interface ProductCardProps {
  product: ProductDisplay;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { primary, secondary } = formatPriceDual(product.price, product.currency);
  const discount = product.originalPrice ? calcDiscount(product.originalPrice, product.price) : 0;

  return (
    <Card hover className="overflow-hidden flex flex-col">
      <Link href={`/p/${product.slug}`} className="block relative aspect-square bg-gray-50">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />
        )}
        {discount > 0 && (
          <div className="absolute top-2 start-2">
            <Badge variant="sale">-{discount}%</Badge>
          </div>
        )}
        {product.couponCode && (
          <div className="absolute top-2 end-2">
            <Badge variant="coupon">קופון</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex gap-2 flex-wrap">
          {product.brandName && <Badge variant="brand">{product.brandName}</Badge>}
          {product.categoryName && <Badge variant="category">{product.categoryName}</Badge>}
        </div>

        <Link href={`/p/${product.slug}`} className="hover:text-primary transition-colors">
          <h3 className="text-sm font-medium line-clamp-2 leading-snug">{product.title}</h3>
        </Link>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{primary}</span>
            {secondary && <span className="text-xs text-muted">{secondary}</span>}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted pt-1">
          {product.rating && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
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
