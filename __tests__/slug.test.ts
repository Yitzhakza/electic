import { describe, it, expect } from 'vitest';
import { generateSlug, generateProductSlug } from '@/lib/utils/slug';

describe('generateSlug', () => {
  it('should convert title to lowercase slug', () => {
    expect(generateSlug('Tesla Model 3 Floor Mat')).toBe('tesla-model-3-floor-mat');
  });

  it('should remove Hebrew characters', () => {
    expect(generateSlug('שטיחים לטסלה Model 3')).toBe('model-3');
  });

  it('should handle special characters', () => {
    expect(generateSlug('BYD Atto 3 - Screen Protector (HD)')).toBe('byd-atto-3-screen-protector-hd');
  });

  it('should collapse multiple hyphens', () => {
    expect(generateSlug('Tesla---Model---3')).toBe('tesla-model-3');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(generateSlug('---Tesla Model 3---')).toBe('tesla-model-3');
  });

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should limit length to 200 characters', () => {
    const longTitle = 'a'.repeat(300);
    expect(generateSlug(longTitle).length).toBeLessThanOrEqual(200);
  });
});

describe('generateProductSlug', () => {
  it('should append product ID suffix', () => {
    const slug = generateProductSlug('Tesla Model 3 Floor Mat', '1234567890');
    expect(slug).toBe('tesla-model-3-floor-mat-34567890');
  });

  it('should use just ID for Hebrew-only titles', () => {
    const slug = generateProductSlug('שטיחים לרכב', '12345678');
    expect(slug).toBe('12345678');
  });
});
