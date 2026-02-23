const TRUST_ITEMS = [
  { icon: '🔒', label: 'קנייה מאובטחת', sublabel: 'אליאקספרס' },
  { icon: '🚚', label: 'משלוח לישראל', sublabel: '15-30 ימים' },
  { icon: '✅', label: 'מוכר מאומת', sublabel: 'דירוג גבוה' },
  { icon: '↩️', label: 'החזרה קלה', sublabel: 'הגנת קונה' },
];

interface TrustSignalsProps {
  variant?: 'horizontal' | 'compact';
}

export default function TrustSignals({ variant = 'horizontal' }: TrustSignalsProps) {
  return (
    <div className={`grid ${variant === 'horizontal' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'} gap-3`}>
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-border/50"
        >
          <span className="text-xl">{item.icon}</span>
          <div>
            <p className="text-xs font-medium">{item.label}</p>
            <p className="text-[11px] text-muted">{item.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
