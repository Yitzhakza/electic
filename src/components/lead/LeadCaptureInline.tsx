import LeadCaptureForm from './LeadCaptureForm';

interface LeadCaptureInlineProps {
  source: string;
}

export default function LeadCaptureInline({ source }: LeadCaptureInlineProps) {
  return (
    <div className="bg-gradient-to-bl from-blue-50 to-slate-50 rounded-2xl border border-blue-200/50 p-8 my-10">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">קבלו מדריך טעינה ביתית חינם</h3>
        <p className="text-sm text-muted mt-1">מדריך מקיף עם כל מה שצריך לדעת על טעינה ביתית בישראל</p>
      </div>
      <LeadCaptureForm source={source} compact />
    </div>
  );
}
