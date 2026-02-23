const ILS_EXCHANGE_RATE = 3.7; // Approximate USD to ILS

/**
 * Format a price for display.
 * Shows both USD and ILS estimate.
 */
export function formatPrice(price: number, currency = 'USD'): string {
  if (currency === 'ILS') {
    return `₪${price.toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
}

/**
 * Convert USD to estimated ILS.
 */
export function usdToIls(usd: number): number {
  return Math.round(usd * ILS_EXCHANGE_RATE * 100) / 100;
}

/**
 * Format price with both currencies for display.
 */
export function formatPriceDual(price: number, currency = 'USD'): { primary: string; secondary: string } {
  if (currency === 'USD') {
    return {
      primary: `$${price.toFixed(2)}`,
      secondary: `~₪${usdToIls(price).toFixed(0)}`,
    };
  }
  return {
    primary: `₪${price.toFixed(2)}`,
    secondary: '',
  };
}

/**
 * Calculate discount percentage.
 */
export function calcDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Normalize a price value from various formats to a number.
 */
export function normalizePrice(value: unknown): number {
  if (typeof value === 'number') return Math.round(value * 100) / 100;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
  }
  return 0;
}
