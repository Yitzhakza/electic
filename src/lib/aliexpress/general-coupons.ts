/**
 * AliExpress general coupons for Israel.
 *
 * AliExpress publishes tiered coupon codes every month for Israeli buyers.
 * The pattern is consistent: IL + MONTH_ABBREVIATION + TIER_NUMBER
 * e.g. ILFEB1, ILFEB2 … ILFEB7
 *
 * The tiers and minimum-spend thresholds are stable across months.
 * This module generates them dynamically so the coupons page always
 * shows the current month's codes without manual updates.
 */

const MONTH_CODES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const;

const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
] as const;

const COUPON_TIERS = [
  { discount: 2, minSpend: 15 },
  { discount: 4, minSpend: 29 },
  { discount: 6, minSpend: 49 },
  { discount: 10, minSpend: 79 },
  { discount: 20, minSpend: 159 },
  { discount: 30, minSpend: 249 },
  { discount: 45, minSpend: 369 },
] as const;

export interface GeneralCoupon {
  code: string;
  discount: number;
  minSpend: number;
  tier: number;
}

export interface GeneralCouponsData {
  coupons: GeneralCoupon[];
  monthNameHe: string;
  monthCode: string;
  validUntil: string;
}

export function getCurrentGeneralCoupons(): GeneralCouponsData {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthCode = MONTH_CODES[month];
  const monthNameHe = HEBREW_MONTHS[month];

  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);
  const validUntil = lastDay.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const coupons: GeneralCoupon[] = COUPON_TIERS.map((tier, i) => ({
    code: `IL${monthCode}${i + 1}`,
    discount: tier.discount,
    minSpend: tier.minSpend,
    tier: i + 1,
  }));

  return { coupons, monthNameHe, monthCode, validUntil };
}
