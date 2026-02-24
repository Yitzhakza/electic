# EV Shop - אתר אפילייט לאביזרי רכב חשמלי

אתר אפילייט בעברית לאביזרים לרכבים חשמליים בישראל. מבוסס על מוצרים מ-AliExpress עם עדכון יומי אוטומטי.

## טכנולוגיות

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **סגנון**: Tailwind CSS v4 + RTL
- **בסיס נתונים**: Supabase (PostgreSQL) + Drizzle ORM
- **אימות**: Supabase Auth
- **הרצה מתוזמנת**: Vercel Cron Jobs
- **ולידציה**: Zod
- **בדיקות**: Vitest
- **פריסה**: Vercel

## התקנה מקומית

### דרישות מוקדמות

- Node.js 18+
- חשבון Supabase (חינמי)
- חשבון AliExpress Affiliate (Portals / Open Platform)

### שלבים

1. **שכפול הריפו:**
   ```bash
   git clone <repo-url>
   cd ev-accessories-il
   ```

2. **התקנת תלויות:**
   ```bash
   npm install
   ```

3. **הגדרת משתני סביבה:**
   ```bash
   cp .env.example .env.local
   ```
   ערוך את `.env.local` ומלא את הערכים:
   ```
   ALIEXPRESS_APP_KEY=המפתח_שלך
   ALIEXPRESS_APP_SECRET=הסוד_שלך
   ALIEXPRESS_TRACKING_ID=מזהה_המעקב_שלך
   NEXT_PUBLIC_SUPABASE_URL=כתובת_סופאבייס
   NEXT_PUBLIC_SUPABASE_ANON_KEY=מפתח_אנונימי
   SUPABASE_SERVICE_ROLE_KEY=מפתח_שירות
   DATABASE_URL=postgresql://...
   CRON_SECRET=סוד_ארוך_כלשהו
   ADMIN_EMAIL=admin@example.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **יצירת טבלאות בבסיס הנתונים:**
   ```bash
   npm run db:push
   ```

5. **הכנסת נתוני בסיס:**
   ```bash
   npm run db:seed
   ```

6. **הרצה מקומית:**
   ```bash
   npm run dev
   ```
   האתר יהיה זמין ב-`http://localhost:3000`

## משתני סביבה

| משתנה | תיאור |
|---|---|
| `ALIEXPRESS_APP_KEY` | מפתח אפליקציה מ-AliExpress Open Platform |
| `ALIEXPRESS_APP_SECRET` | סוד האפליקציה |
| `ALIEXPRESS_TRACKING_ID` | מזהה מעקב לקישורי אפילייט |
| `NEXT_PUBLIC_SUPABASE_URL` | כתובת פרויקט Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | מפתח אנונימי של Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | מפתח שירות של Supabase (סרבר בלבד) |
| `DATABASE_URL` | כתובת חיבור PostgreSQL (מ-Supabase) |
| `CRON_SECRET` | סוד לאימות בקשות cron |
| `ADMIN_EMAIL` | כתובת דוא"ל למנהל |
| `NEXT_PUBLIC_SITE_URL` | כתובת האתר |

## הרצת סנכרון ידני

### דרך ממשק הניהול
היכנס ל-`/admin/sync` ולחץ "הפעל סנכרון ידני".

### דרך API
```bash
curl -X POST http://localhost:3000/api/cron/sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## הפעלת Cron בפרודקשן

הקובץ `vercel.json` כבר מוגדר להריץ סנכרון יומי בשעה 03:00 UTC:
```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 3 * * *"
    }
  ]
}
```

ב-Vercel, הגדר את `CRON_SECRET` ב-Settings > Environment Variables.

## מבנה הפרויקט

```
src/
├── app/                    # דפי Next.js (App Router)
│   ├── page.tsx            # דף בית
│   ├── brand/[slug]/       # דפי מותג
│   ├── p/[slug]/           # דפי מוצר
│   ├── all-vehicles/       # כל הרכבים
│   ├── search/             # חיפוש
│   ├── admin/              # ממשק ניהול
│   └── api/                # API routes
├── components/             # קומפוננטות React
├── lib/
│   ├── aliexpress/         # AliExpress API client
│   ├── db/                 # סכימת DB + seed
│   ├── sync/               # מנוע סנכרון + מסווג
│   ├── supabase/           # Supabase clients
│   └── utils/              # slug, price utilities
└── types/                  # TypeScript types
```

## מותגים נתמכים

Tesla, BYD, MG, NIO, XPeng, Geely, Changan/Deepal, Chery, Zeekr, Skywell, CUPRA, Hyundai (EV), Kia (EV), Volkswagen (ID), Polestar

## קטגוריות אביזרים

שטיחים, מגני מסך, מטענים וכבלים, מחזיקי טלפון, ארגון תא מטען, תאורה פנימית, כיסויי רכב, כיסויי מושבים, כיסויי הגה, אביזרי לוח מחוונים

## בדיקות

```bash
npm run test        # הרצה חד-פעמית
npm run test:watch  # מצב צפייה
```

## הערות חשובות

- **AliExpress API**: הקליינט בנוי כ-adapter עם TODOs ברורים לנקודות שדורשות התאמה לפי הדוקומנטציה הרשמית. ראו `src/lib/aliexpress/client.ts`.
- **אימות חתימה**: מנגנון החתימה (HMAC-SHA256) ממומש אך עשוי לדרוש התאמות לפי גרסת ה-API.
- **תמונות**: האתר משתמש בתמונות ישירות מ-AliExpress CDN. ניתן להוסיף cache/optimization עם Vercel Image Optimization.
- **קופונים**: נתמכים גם מה-API וגם כ-override ידני דרך ממשק הניהול.

## פריסה ב-Vercel

1. חבר את הריפו ל-Vercel
2. הגדר את כל משתני הסביבה ב-Settings > Environment Variables
3. Vercel יבנה ויפרוס אוטומטית
4. ה-cron job יתחיל לרוץ מיד לאחר הפריסה
