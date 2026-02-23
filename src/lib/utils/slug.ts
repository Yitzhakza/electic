/**
 * Generate a URL-safe slug from a product title.
 * Prefers English characters, strips Hebrew and special chars.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    // Remove Hebrew characters
    .replace(/[\u0590-\u05FF]/g, '')
    // Replace common separators with hyphens
    .replace(/[_\s/\\|+]+/g, '-')
    // Remove non-alphanumeric (keep hyphens and dots)
    .replace(/[^a-z0-9\-\.]/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .slice(0, 200);
}

/**
 * Generate a unique product slug by appending the product ID.
 */
export function generateProductSlug(title: string, productId: string): string {
  const base = generateSlug(title);
  // Ensure uniqueness by appending the AliExpress product ID
  const shortId = productId.slice(-8);
  return base ? `${base}-${shortId}` : shortId;
}
