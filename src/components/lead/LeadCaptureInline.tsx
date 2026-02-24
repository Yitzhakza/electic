import LeadCaptureForm from './LeadCaptureForm';

interface LeadCaptureInlineProps {
  source: string;
}

export default function LeadCaptureInline({ source }: LeadCaptureInlineProps) {
  return (
    <div className="bg-surface-alt rounded-2xl border border-border/40 p-8 md:p-10 my-12">
      <div className="text-center mb-4">
        <span className="inline-block text-accent text-sm font-semibold mb-2">מדריך חינם</span>
        <h3 className="text-xl font-bold text-text">קבלו מדריך טעינה ביתית חינם</h3>
        <p className="text-sm text-muted mt-2">מדריך מקיף עם כל מה שצריך לדעת על טעינה ביתית בישראל</p>
      </div>
      <LeadCaptureForm source={source} compact />
    </div>
  );
}
