import { describe, it, expect } from 'vitest';
import { classifyBrand, classifyCategory, extractBrandHints, extractCategoryHints } from '@/lib/sync/classifier';

describe('classifyBrand', () => {
  it('should detect Tesla from product title', () => {
    expect(classifyBrand('Tesla Model 3 Floor Mat All Weather')).toBe('tesla');
  });

  it('should detect Tesla Model Y', () => {
    expect(classifyBrand('2024 Model Y Trunk Organizer Storage')).toBe('tesla');
  });

  it('should detect BYD Atto 3', () => {
    expect(classifyBrand('BYD Atto 3 Screen Protector Tempered Glass')).toBe('byd');
  });

  it('should detect MG4', () => {
    expect(classifyBrand('MG4 EV Car Floor Liner Rubber Mat')).toBe('mg');
  });

  it('should detect Hyundai Ioniq 5', () => {
    expect(classifyBrand('Ioniq 5 Center Console Storage Box')).toBe('hyundai');
  });

  it('should detect Volkswagen ID.4', () => {
    expect(classifyBrand('VW ID.4 Trunk Mat Cargo Liner')).toBe('volkswagen');
  });

  it('should detect NIO', () => {
    expect(classifyBrand('NIO ET5 Floor Mat Premium')).toBe('nio');
  });

  it('should return null for generic product', () => {
    expect(classifyBrand('Universal Car Phone Holder Mount')).toBeNull();
  });

  it('should prefer longer keyword matches', () => {
    // "model 3" (7 chars) should match tesla over a brand with shorter keywords
    expect(classifyBrand('Model 3 Accessories Package')).toBe('tesla');
  });
});

describe('classifyCategory', () => {
  it('should detect floor mats', () => {
    expect(classifyCategory('Tesla Model 3 Floor Mat All Weather')).toBe('floor-mats');
  });

  it('should detect screen protectors', () => {
    expect(classifyCategory('BYD Atto 3 Screen Protector Tempered Glass')).toBe('screen-protectors');
  });

  it('should detect chargers', () => {
    expect(classifyCategory('EV Portable Charger Type 2 Cable')).toBe('chargers');
  });

  it('should detect phone holders', () => {
    expect(classifyCategory('Car Magnetic Phone Holder Mount')).toBe('phone-holders');
  });

  it('should detect trunk organizers', () => {
    expect(classifyCategory('Tesla Model Y Trunk Organizer Storage')).toBe('trunk-organizers');
  });

  it('should detect interior lighting', () => {
    expect(classifyCategory('Car Interior LED Strip Ambient Light')).toBe('interior-lighting');
  });

  it('should return null for non-matching text', () => {
    expect(classifyCategory('Generic Car Part XYZ')).toBeNull();
  });
});

describe('extractBrandHints', () => {
  it('should extract multiple brand hints', () => {
    // A product that mentions multiple brands
    const hints = extractBrandHints('Tesla Model 3 Model Y Compatible Floor Mat');
    expect(hints).toContain('tesla');
  });

  it('should return empty for no matches', () => {
    expect(extractBrandHints('Universal accessory')).toEqual([]);
  });
});

describe('extractCategoryHints', () => {
  it('should extract multiple category hints', () => {
    const hints = extractCategoryHints('Car Floor Mat with Trunk Organizer Set');
    expect(hints).toContain('floor-mats');
    expect(hints).toContain('trunk-organizers');
  });
});
