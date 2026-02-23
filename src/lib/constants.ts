export const BRANDS = [
  { slug: 'tesla', nameHe: 'טסלה', nameEn: 'Tesla', order: 1, models: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
  { slug: 'byd', nameHe: 'BYD', nameEn: 'BYD', order: 2, models: ['Atto 3', 'Seal', 'Dolphin', 'Han', 'Tang'] },
  { slug: 'mg', nameHe: 'MG', nameEn: 'MG', order: 3, models: ['MG4', 'MG5', 'ZS EV', 'Marvel R'] },
  { slug: 'nio', nameHe: 'NIO', nameEn: 'NIO', order: 4, models: ['ET5', 'ET7', 'EL7', 'EC7'] },
  { slug: 'xpeng', nameHe: 'XPeng', nameEn: 'XPeng', order: 5, models: ['G6', 'G9', 'P7'] },
  { slug: 'geely', nameHe: 'ג\'ילי', nameEn: 'Geely', order: 6, models: ['Geometry C', 'Galaxy E5'] },
  { slug: 'chery', nameHe: "צ'רי", nameEn: 'Chery', order: 7, models: ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'eQ7'] },
  { slug: 'zeekr', nameHe: 'זיקר', nameEn: 'Zeekr', order: 8, models: ['001', 'X', '007'] },
  { slug: 'skywell', nameHe: 'סקייוול', nameEn: 'Skywell', order: 9, models: ['ET5'] },
  { slug: 'cupra', nameHe: 'קופרה', nameEn: 'CUPRA', order: 10, models: ['Born'] },
  { slug: 'hyundai', nameHe: 'יונדאי', nameEn: 'Hyundai', order: 11, models: ['Ioniq 5', 'Ioniq 6', 'Kona Electric'] },
  { slug: 'kia', nameHe: 'קיה', nameEn: 'Kia', order: 12, models: ['EV6', 'EV9', 'Niro EV'] },
  { slug: 'volkswagen', nameHe: 'פולקסווגן', nameEn: 'Volkswagen', order: 13, models: ['ID.3', 'ID.4', 'ID.5'] },
  { slug: 'polestar', nameHe: 'פולסטאר', nameEn: 'Polestar', order: 14, models: ['Polestar 2', 'Polestar 4'] },
] as const;

export const ACCESSORY_CATEGORIES = [
  {
    slug: 'floor-mats',
    nameHe: 'שטיחים',
    nameEn: 'Floor Mats',
    keywords: ['floor mat', 'floor liner', 'carpet', 'rubber mat', 'all weather mat'],
    order: 1,
  },
  {
    slug: 'screen-protectors',
    nameHe: 'מגני מסך',
    nameEn: 'Screen Protectors',
    keywords: ['screen protector', 'tempered glass', 'display protector', 'screen film', 'navigation screen'],
    order: 2,
  },
  {
    slug: 'chargers',
    nameHe: 'מטענים וכבלים',
    nameEn: 'Chargers & Cables',
    keywords: ['charger', 'charging cable', 'ev charger', 'type 2', 'charging adapter', 'portable charger'],
    order: 3,
  },
  {
    slug: 'phone-holders',
    nameHe: 'מחזיקי טלפון',
    nameEn: 'Phone Holders',
    keywords: ['phone holder', 'phone mount', 'phone stand', 'wireless charger mount', 'magnetic holder'],
    order: 4,
  },
  {
    slug: 'trunk-organizers',
    nameHe: 'ארגון תא מטען',
    nameEn: 'Trunk Organizers',
    keywords: ['trunk organizer', 'trunk mat', 'trunk liner', 'cargo net', 'trunk storage', 'boot liner'],
    order: 5,
  },
  {
    slug: 'interior-lighting',
    nameHe: 'תאורה פנימית',
    nameEn: 'Interior Lighting',
    keywords: ['interior light', 'ambient light', 'led strip', 'interior lamp', 'footwell light', 'door light'],
    order: 6,
  },
  {
    slug: 'car-covers',
    nameHe: 'כיסויי רכב',
    nameEn: 'Car Covers',
    keywords: ['car cover', 'vehicle cover', 'sun shade', 'windshield cover', 'sunshade'],
    order: 7,
  },
  {
    slug: 'seat-covers',
    nameHe: 'כיסויי מושבים',
    nameEn: 'Seat Covers',
    keywords: ['seat cover', 'seat protector', 'seat cushion', 'back protector', 'headrest'],
    order: 8,
  },
  {
    slug: 'steering-wheel',
    nameHe: 'כיסויי הגה',
    nameEn: 'Steering Wheel Covers',
    keywords: ['steering wheel cover', 'steering cover', 'wheel cover', 'steering wrap'],
    order: 9,
  },
  {
    slug: 'dashboard',
    nameHe: 'אביזרי לוח מחוונים',
    nameEn: 'Dashboard Accessories',
    keywords: ['dashboard', 'dash cover', 'dash mat', 'center console', 'cup holder', 'storage box', 'armrest'],
    order: 10,
  },
  {
    slug: 'general-accessories',
    nameHe: 'אביזרים כלליים',
    nameEn: 'General Accessories',
    keywords: ['universal', 'car charger', 'dash cam', 'usb hub', 'car vacuum', 'air freshener', 'tire inflator', 'jump starter'],
    order: 11,
  },
] as const;

export const BRAND_KEYWORDS: Record<string, string[]> = {
  tesla: ['tesla', 'model 3', 'model y', 'model s', 'model x'],
  byd: ['byd', 'atto 3', 'atto3', 'seal', 'dolphin', 'han ev', 'tang ev'],
  mg: ['mg4', 'mg5', 'mg zs', 'zs ev', 'marvel r', 'mg motor'],
  nio: ['nio', 'et5', 'et7', 'el7', 'ec7'],
  xpeng: ['xpeng', 'xpev', 'g6', 'g9', 'p7'],
  geely: ['geely', 'geometry c', 'geometry', 'galaxy e5'],
  chery: ['chery', 'tiggo', 'eq7'],
  zeekr: ['zeekr', '001', '007'],
  skywell: ['skywell'],
  cupra: ['cupra', 'born'],
  hyundai: ['hyundai', 'ioniq 5', 'ioniq 6', 'ioniq5', 'ioniq6', 'kona electric'],
  kia: ['kia', 'ev6', 'ev9', 'niro ev'],
  volkswagen: ['volkswagen', 'vw', 'id.3', 'id.4', 'id.5', 'id3', 'id4', 'id5'],
  polestar: ['polestar'],
};

export const CATEGORY_KEYWORDS: Record<string, string[]> = Object.fromEntries(
  ACCESSORY_CATEGORIES.map((cat) => [cat.slug, cat.keywords as unknown as string[]])
);

export function generateSearchQueries(): Array<{ brandSlug: string; categorySlug: string | null; query: string }> {
  const queries: Array<{ brandSlug: string; categorySlug: string | null; query: string }> = [];

  for (const brand of BRANDS) {
    // General brand accessories query
    queries.push({ brandSlug: brand.slug, categorySlug: null, query: `${brand.nameEn} electric car accessories` });

    for (const model of brand.models) {
      // General model query
      queries.push({ brandSlug: brand.slug, categorySlug: null, query: `${model} accessories` });

      // Model + category queries for key categories
      for (const cat of ACCESSORY_CATEGORIES) {
        queries.push({
          brandSlug: brand.slug,
          categorySlug: cat.slug,
          query: `${model} ${cat.keywords[0]}`,
        });
      }
    }
  }

  return queries;
}
