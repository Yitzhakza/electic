import { describe, it, expect } from 'vitest';
import { formatPrice, usdToIls, formatPriceDual, calcDiscount, normalizePrice } from '@/lib/utils/price';

describe('formatPrice', () => {
  it('should format USD price', () => {
    expect(formatPrice(45.99)).toBe('$45.99');
  });

  it('should format ILS price', () => {
    expect(formatPrice(170.13, 'ILS')).toBe('₪170.13');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});

describe('usdToIls', () => {
  it('should convert USD to ILS with approximate rate', () => {
    const result = usdToIls(10);
    expect(result).toBe(37); // 10 * 3.7
  });

  it('should handle decimals', () => {
    const result = usdToIls(45.99);
    expect(result).toBeCloseTo(170.16, 1);
  });
});

describe('formatPriceDual', () => {
  it('should return both USD and ILS for USD prices', () => {
    const result = formatPriceDual(10, 'USD');
    expect(result.primary).toBe('$10.00');
    expect(result.secondary).toBe('~₪37');
  });

  it('should return only ILS for ILS prices', () => {
    const result = formatPriceDual(37, 'ILS');
    expect(result.primary).toBe('₪37.00');
    expect(result.secondary).toBe('');
  });
});

describe('calcDiscount', () => {
  it('should calculate correct discount percentage', () => {
    expect(calcDiscount(100, 70)).toBe(30);
  });

  it('should return 0 when sale price >= original', () => {
    expect(calcDiscount(50, 50)).toBe(0);
    expect(calcDiscount(50, 60)).toBe(0);
  });

  it('should return 0 for invalid original price', () => {
    expect(calcDiscount(0, 50)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(calcDiscount(69.99, 45.99)).toBe(34);
  });
});

describe('normalizePrice', () => {
  it('should handle number input', () => {
    expect(normalizePrice(45.99)).toBe(45.99);
  });

  it('should handle string with currency symbol', () => {
    expect(normalizePrice('$45.99')).toBe(45.99);
  });

  it('should handle string with spaces', () => {
    expect(normalizePrice('45.99 USD')).toBe(45.99);
  });

  it('should return 0 for invalid input', () => {
    expect(normalizePrice(null)).toBe(0);
    expect(normalizePrice(undefined)).toBe(0);
    expect(normalizePrice('abc')).toBe(0);
  });
});
