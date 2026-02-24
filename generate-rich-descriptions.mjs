import postgres from 'postgres';

const sql = postgres('postgresql://postgres.nlgvnlrvzzwowvsjfpdz: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@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres', { prepare: false });

const BRANDS = [
  { slug: 'tesla', nameHe: 'טסלה', models: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
  { slug: 'byd', nameHe: 'BYD', models: ['Atto 3', 'Seal', 'Dolphin', 'Han', 'Tang'] },
  { slug: 'mg', nameHe: 'MG', models: ['MG4', 'MG5', 'ZS EV', 'Marvel R'] },
  { slug: 'nio', nameHe: 'NIO', models: ['ET5', 'ET7', 'EL7', 'EC7'] },
  { slug: 'xpeng', nameHe: 'XPeng', models: ['G6', 'G9', 'P7'] },
  { slug: 'geely', nameHe: "ג'ילי", models: ['Geometry C', 'Galaxy E5'] },
  { slug: 'chery', nameHe: "צ'רי", models: ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'eQ7'] },
  { slug: 'zeekr', nameHe: 'זיקר', models: ['001', 'X', '007'] },
  { slug: 'skywell', nameHe: 'סקייוול', models: ['ET5'] },
  { slug: 'cupra', nameHe: 'קופרה', models: ['Born'] },
  { slug: 'hyundai', nameHe: 'יונדאי', models: ['Ioniq 5', 'Ioniq 6', 'Kona Electric'] },
  { slug: 'kia', nameHe: 'קיה', models: ['EV6', 'EV9', 'Niro EV'] },
  { slug: 'volkswagen', nameHe: 'פולקסווגן', models: ['ID.3', 'ID.4', 'ID.5'] },
  { slug: 'polestar', nameHe: 'פולסטאר', models: ['Polestar 2', 'Polestar 4'] },
];

function findModel(title, brandSlug) {
  const brand = BRANDS.find(b => b.slug === brandSlug);
  if (!brand) return '';
  const lower = title.toLowerCase();
  for (const model of brand.models) {
    if (lower.includes(model.toLowerCase())) return model;
  }
  return '';
}

function getBrandHe(brandSlug) {
  const brand = BRANDS.find(b => b.slug === brandSlug);
  return brand?.nameHe ?? '';
}

function ratingLine(rating, orders) {
  const parts = [];
  if (rating && rating >= 4.0) parts.push(`דירוג ${rating.toFixed(1)} מתוך 5`);
  if (orders >= 50) parts.push(`נרכש על ידי ${orders.toLocaleString()} לקוחות`);
  return parts.length > 0 ? parts.join(' · ') + '.' : '';
}

const TEMPLATES = {
  'floor-mats': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `שטיחי רצפה מותאמים ל${target} — עשויים מחומרים איכותיים ועמידים בפני מים, לכלוך ושחיקה יומיומית.`,
      `העיצוב המדויק מבטיח כיסוי מלא של רצפת הרכב כולל השוליים, כך שהרצפה המקורית נשארת מוגנת לאורך זמן. ההתקנה פשוטה וללא כלים — פשוט מניחים במקום.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'screen-protectors': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `מגן מסך מזכוכית מחוסמת ל${target} — שומר על מסך המולטימדיה מפני שריטות, טביעות אצבע ולכלוך.`,
      `שקיפות גבוהה שלא פוגעת באיכות התצוגה, ציפוי אנטי-סינוור ואנטי-טביעות. ההדבקה חלקה עם ערכת התקנה מלאה שמגיעה באריזה.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'chargers': (brand, model, rating, orders) => {
    const target = brand ? `ל${brand}` : 'לרכב חשמלי';
    return [
      `מטען איכותי ${target} — טעינה מהירה ובטוחה עם הגנות מובנות נגד עומס יתר, חימום ותקלות חשמל.`,
      `תואם לתקני טעינה מובילים ומגיע עם כבל באורך נוח. פתרון אידיאלי לטעינה ביתית או בדרכים, עם עיצוב קומפקטי שקל לאחסון.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'phone-holders': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'רכב חשמלי';
    return [
      `מחזיק טלפון יציב ואיכותי ל${target} — מאפשר ניווט בטוח ונוח תוך כדי נהיגה.`,
      `אחיזה חזקה שמתאימה לכל גודל סמארטפון, עם מנגנון הידוק קל לתפעול ביד אחת. ההתקנה מהירה ולא משאירה סימנים ברכב.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'trunk-organizers': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `ארגונית תא מטען מעשית ל${target} — שומרת על סדר ומונעת תזוזה של חפצים בזמן נסיעה.`,
      `תאים מרובים עם מחיצות מתכווננות שמתאימים לקניות, ציוד ספורט או חפצי יומיום. החומר עמיד, קל לניקוי, ומתקפל כשלא בשימוש.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'interior-lighting': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `תאורת אווירה פנימית ל${target} — משדרגת את חוויית הנסיעה עם תאורה עדינה ואלגנטית.`,
      `תאורת LED חסכונית עם מגוון צבעים ועוצמות. ההתקנה פשוטה, לא דורשת שינויים ברכב, ומוסיפה מראה מודרני ויוקרתי לתא הנוסעים.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'car-covers': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `כיסוי רכב מלא ל${target} — הגנה מפני שמש, גשם, אבק, שלג ולכלוך ציפורים.`,
      `עשוי מבד רב-שכבתי עמיד בפני UV ומים, עם ביטנה רכה שלא שורטת את הצבע. כולל רצועות אלסטיות ואבזמים להידוק שמונעים עפיפה ברוח.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'seat-covers': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `כיסוי מושבים איכותי ל${target} — שומר על ריפוד המושבים המקורי ומוסיף נוחות לנסיעה.`,
      `עשוי מחומר נושם ונעים למגע, קל להתקנה והסרה. עמיד בפני שפיכות, לכלוך ושחיקה יומיומית. תואם את עיצוב הפנים של הרכב בצורה טבעית.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'steering-wheel': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `כיסוי הגה נעים למגע ל${target} — משפר את האחיזה ומגן על ההגה המקורי מפני שחיקה.`,
      `עשוי מחומר איכותי שלא מחליק, מתאים לכל עונות השנה. ההתקנה מהירה וקלה, ומוסיף מראה יוקרתי לתא הנהג.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'dashboard': (brand, model, rating, orders) => {
    const target = model ? `${brand} ${model}` : brand || 'הרכב החשמלי שלכם';
    return [
      `אביזר לוח מחוונים שימושי ל${target} — מוסיף אחסון נוח ונגישות לחפצים יומיומיים באזור הנהג.`,
      `עיצוב מותאם שמשתלב בצורה טבעית עם פנים הרכב. חומר עמיד ואיכותי שלא רועד בנסיעה. פתרון פרקטי שהופך את הנהיגה לנוחה יותר.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },

  'general-accessories': (brand, model, rating, orders) => {
    return [
      `אביזר איכותי לרכב חשמלי — מתאים למגוון רחב של דגמים ומותגים.`,
      `מיוצר מחומרים עמידים ואיכותיים, קל לשימוש ולהתקנה. פתרון שימושי ליומיום שמשדרג את חוויית הנהיגה ברכב החשמלי.`,
      ratingLine(rating, orders),
    ].filter(Boolean).join('\n\n');
  },
};

const DEFAULT_TEMPLATE = (brand, model, rating, orders) => {
  const target = brand ? `ל${brand}${model ? ' ' + model : ''}` : 'לרכב חשמלי';
  return [
    `אביזר איכותי ${target} — מתוכנן ומותאם לשימוש יומיומי ברכב חשמלי.`,
    `חומרים עמידים ואיכותיים, התקנה פשוטה ומהירה. משדרג את חוויית הנהיגה ושומר על הרכב במצב מעולה.`,
    ratingLine(rating, orders),
  ].filter(Boolean).join('\n\n');
};

async function run() {
  // Get all active products with brand and category info
  const rows = await sql`
    SELECT p.id, p.title_original, p.rating, p.total_orders,
           b.slug as brand_slug, b.name_he as brand_name,
           c.slug as category_slug, c.name_he as category_name,
           po.description_he_override
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN accessory_categories c ON p.category_id = c.id
    LEFT JOIN product_overrides po ON po.product_id = p.id
    WHERE p.is_active = true
    ORDER BY p.id
  `;

  console.log(`Found ${rows.length} active products`);

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    // Skip products with manual description override
    if (row.description_he_override) {
      skipped++;
      continue;
    }

    const brandHe = row.brand_name || getBrandHe(row.brand_slug) || '';
    const model = findModel(row.title_original, row.brand_slug);
    const catSlug = row.category_slug || '';
    const template = TEMPLATES[catSlug] || DEFAULT_TEMPLATE;
    const description = template(brandHe, model, row.rating, row.total_orders);

    await sql`UPDATE products SET description_he = ${description} WHERE id = ${row.id}`;
    updated++;
  }

  console.log(`Updated: ${updated}, Skipped (has override): ${skipped}`);
  await sql.end();
}

run().catch(e => { console.error(e); process.exit(1); });
