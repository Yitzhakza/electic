interface WhyBuyFromUsProps {
  variant?: 'full' | 'compact';
}

const ITEMS = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'מוצרים נבדקים ומאומתים',
    description: 'כל מוצר באתר עובר בדיקה קפדנית. אנחנו בוחרים רק מוצרים עם דירוג גבוה, ביקורות חיוביות ומוכרים אמינים באליאקספרס.',
    shortDesc: 'מוצרים עם דירוג גבוה ומוכרים אמינים',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'מחירים שקופים ומעודכנים',
    description: 'המחירים מתעדכנים אוטומטית כל יום ישירות מאליאקספרס. מה שאתם רואים באתר זה המחיר האמיתי, ללא הפתעות ועמלות נסתרות.',
    shortDesc: 'מחירים מתעדכנים יומית מאליאקספרס',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'משלוח ישיר לישראל',
    description: 'כל המוצרים נשלחים ישירות אליכם הביתה. אנחנו מוודאים שהמוכרים שולחים לישראל ומציגים את זמני המשלוח המשוערים.',
    shortDesc: 'משלוח ישיר לכל הארץ',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'קנייה בטוחה ומאובטחת',
    description: 'הרכישה מתבצעת ישירות באליאקספרס עם הגנת קונה מלאה. אם המוצר לא הגיע או לא תואם את התיאור — מקבלים החזר כספי.',
    shortDesc: 'רכישה באליאקספרס עם הגנת קונה',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    title: 'קופונים והנחות בלעדיות',
    description: 'אנחנו מחפשים עבורכם את הקופונים והמבצעים הטובים ביותר ומעדכנים אותם באופן אוטומטי מאליאקספרס. חסכו כסף בכל רכישה.',
    shortDesc: 'קופונים מתעדכנים אוטומטית',
  },
];

export default function WhyBuyFromUs({ variant = 'full' }: WhyBuyFromUsProps) {
  const items = variant === 'compact' ? ITEMS.slice(0, 3) : ITEMS;

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3 bg-surface-alt rounded-lg p-3 border border-border/40">
            <div className="text-accent shrink-0">{item.icon}</div>
            <div>
              <p className="text-xs font-medium text-text">{item.title}</p>
              <p className="text-xs text-muted">{item.shortDesc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {items.map((item) => (
        <div key={item.title}>
          <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
            {item.icon}
          </div>
          <h3 className="text-lg font-bold mb-2 text-text">{item.title}</h3>
          <p className="text-sm text-muted leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
