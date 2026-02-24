import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'EV Shop <guide@ev-shop.co.il>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

export async function sendChargingGuideEmail(to: string, carModel?: string | null) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping email send');
    return null;
  }

  const carLine = carModel ? `<p style="font-size:14px;color:#666;margin:0 0 16px">הדגם שלכם: <strong>${carModel}</strong></p>` : '';

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0ea5e9,#22c55e);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center">
    <h1 style="color:#fff;font-size:24px;margin:0 0 8px">⚡ EV Shop</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:0">מדריך טעינה ביתית לרכב חשמלי בישראל</p>
  </div>

  <!-- Body -->
  <div style="background:#fff;padding:32px 24px;border-radius:0 0 16px 16px">
    <p style="font-size:16px;color:#333;margin:0 0 16px">שלום 👋</p>
    <p style="font-size:16px;color:#333;margin:0 0 16px">תודה שנרשמתם! הנה המדריך המלא שלנו לטעינה ביתית בישראל.</p>
    ${carLine}

    <!-- Guide Highlights -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:0 0 24px">
      <h2 style="font-size:18px;color:#166534;margin:0 0 12px">📋 מה תמצאו במדריך</h2>
      <ul style="font-size:14px;color:#333;margin:0;padding:0 20px;line-height:2">
        <li>סוגי מטענים ביתיים (רמה 1, רמה 2, DC)</li>
        <li>עלויות התקנה ורגולציה בישראל</li>
        <li>תעריפי חשמל וטעינה בשעות זולות</li>
        <li>טיפים לטעינה בבניין משותף</li>
        <li>השוואת מטענים מומלצים</li>
      </ul>
    </div>

    <!-- CTA: Full Guide -->
    <div style="text-align:center;margin:0 0 24px">
      <a href="${SITE_URL}/charging/home-charging-israel" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:bold">
        קראו את המדריך המלא ←
      </a>
    </div>

    <!-- Calculator Section -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:0 0 24px">
      <h2 style="font-size:18px;color:#1e40af;margin:0 0 8px">🔢 מחשבון עלות טעינה</h2>
      <p style="font-size:14px;color:#333;margin:0 0 12px">רוצים לדעת כמה תשלמו על טעינה בכל חודש? השתמשו במחשבון שלנו:</p>
      <div style="text-align:center">
        <a href="${SITE_URL}/tools/charging-calculator" style="display:inline-block;background:#1e40af;color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:15px;font-weight:bold">
          פתחו את המחשבון ←
        </a>
      </div>
    </div>

    <!-- Quick Tips -->
    <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin:0 0 24px">
      <h3 style="font-size:16px;color:#333;margin:0 0 12px">💡 טיפ מהיר: חסכו 40% בחשמל</h3>
      <p style="font-size:14px;color:#666;margin:0">
        אם אתם בתעריף גמיש של חברת החשמל, טענו בשעות הלילה (23:00-07:00) ושלמו רק ₪0.35 לקוט&quot;ש
        במקום ₪0.65. על 1,500 ק&quot;מ בחודש, זה חיסכון של כ-₪45 בחודש!
      </p>
    </div>

    <!-- Product Recommendations -->
    <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin:0 0 24px">
      <h3 style="font-size:16px;color:#333;margin:0 0 12px">🔌 מטענים מומלצים</h3>
      <p style="font-size:14px;color:#666;margin:0 0 12px">ריכזנו עבורכם את המטענים הביתיים הכי מומלצים עם משלוח לישראל:</p>
      <div style="text-align:center">
        <a href="${SITE_URL}/compare/chargers" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:15px;font-weight:bold">
          השוואת מטענים ←
        </a>
      </div>
    </div>

    <!-- WhatsApp -->
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;margin:0 0 24px">
      <p style="font-size:14px;color:#333;margin:0 0 8px">יש שאלות? אנחנו כאן בשבילכם</p>
      <a href="https://wa.me/972557258823?text=שלום, קיבלתי את מדריך הטעינה ויש לי שאלה" style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;text-decoration:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:bold">
        💬 שלחו הודעה בוואטסאפ
      </a>
    </div>

    <!-- More guides -->
    <div style="border-top:1px solid #e5e7eb;padding-top:20px">
      <h3 style="font-size:16px;color:#333;margin:0 0 12px">📚 מדריכים נוספים</h3>
      <ul style="font-size:14px;color:#0ea5e9;margin:0;padding:0 20px;line-height:2.2">
        <li><a href="${SITE_URL}/blog/monthly-charging-cost-israel" style="color:#0ea5e9">כמה עולה לטעון רכב חשמלי בישראל?</a></li>
        <li><a href="${SITE_URL}/blog/shared-building-charging" style="color:#0ea5e9">טעינה בבניין משותף — המדריך המלא</a></li>
        <li><a href="${SITE_URL}/blog/public-charging-tips" style="color:#0ea5e9">טיפים לטעינה בעמדות ציבוריות</a></li>
        <li><a href="${SITE_URL}/blog/battery-degradation-myths" style="color:#0ea5e9">5 מיתוסים על דגרדציית סוללה</a></li>
      </ul>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:24px 0;font-size:12px;color:#999">
    <p style="margin:0 0 4px">&copy; ${new Date().getFullYear()} EV Shop — אביזרים לרכב חשמלי</p>
    <p style="margin:0">
      <a href="${SITE_URL}" style="color:#999">ev-shop.co.il</a> |
      <a href="${SITE_URL}/privacy" style="color:#999">מדיניות פרטיות</a>
    </p>
  </div>
</div>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: '⚡ מדריך טעינה ביתית לרכב חשמלי — EV Shop',
    html,
  });

  if (error) {
    console.error('Resend email error:', error);
    return null;
  }

  return data;
}
