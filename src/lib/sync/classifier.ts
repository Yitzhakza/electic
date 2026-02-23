import { BRAND_KEYWORDS, CATEGORY_KEYWORDS } from '@/lib/constants';

/**
 * Classify a product title to detect which brand it belongs to.
 * Returns the brand slug or null if no match.
 */
export function classifyBrand(title: string): string | null {
  const lower = title.toLowerCase();

  // Score each brand by number of keyword matches
  let bestBrand: string | null = null;
  let bestScore = 0;

  for (const [brandSlug, keywords] of Object.entries(BRAND_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        // Longer keyword matches get higher score
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestBrand = brandSlug;
    }
  }

  return bestBrand;
}

/**
 * Classify a product title to detect accessory category.
 * Returns the category slug or null if no match.
 */
export function classifyCategory(title: string): string | null {
  const lower = title.toLowerCase();

  let bestCategory: string | null = null;
  let bestScore = 0;

  for (const [catSlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = catSlug;
    }
  }

  return bestCategory;
}

/**
 * Extract all brand hints from a title.
 * Returns array of matching brand slugs.
 */
export function extractBrandHints(title: string): string[] {
  const lower = title.toLowerCase();
  const hints: string[] = [];

  for (const [brandSlug, keywords] of Object.entries(BRAND_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        hints.push(brandSlug);
        break;
      }
    }
  }

  return hints;
}

/**
 * Extract all category hints from a title.
 * Returns array of matching category slugs.
 */
export function extractCategoryHints(title: string): string[] {
  const lower = title.toLowerCase();
  const hints: string[] = [];

  for (const [catSlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        hints.push(catSlug);
        break;
      }
    }
  }

  return hints;
}
