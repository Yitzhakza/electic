'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { BRANDS } from '@/lib/constants';

interface LeadCaptureFormProps {
  source: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export default function LeadCaptureForm({ source, onSuccess, compact = false }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: phone || undefined, carModel: carModel || undefined, source }),
      });
      if (!res.ok) throw new Error('שגיאה בשליחה');
      setStatus('success');
      trackEvent('lead_form_submit_success', { source });
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'שגיאה');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">&#10003;</div>
        <p className="text-lg font-bold text-accent mb-2">תודה! המדריך בדרך אליכם</p>
        <p className="text-sm text-muted mb-4">בדקו את תיבת המייל שלכם</p>
        <a
          href="https://wa.me/972557258823?text=שלום, אשמח לקבל ייעוץ לאביזרים לרכב חשמלי"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
          onClick={() => trackEvent('whatsapp_click', { source: 'lead_success' })}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          דברו איתנו בוואטסאפ
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${compact ? '' : 'max-w-md mx-auto'}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="כתובת אימייל *"
        required
        dir="ltr"
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {!compact && (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="טלפון (אופציונלי)"
            dir="ltr"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">בחרו דגם רכב (אופציונלי)</option>
            {BRANDS.map((brand) =>
              brand.models.map((model) => (
                <option key={`${brand.slug}-${model}`} value={`${brand.nameEn} ${model}`}>
                  {brand.nameHe} {model}
                </option>
              ))
            )}
          </select>
        </>
      )}
      <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-0.5 accent-primary" />
        <span>אני מאשר/ת קבלת עדכונים ודילים במייל. ניתן לבטל בכל עת. <a href="/privacy" className="underline">מדיניות פרטיות</a></span>
      </label>
      {status === 'error' && <p className="text-xs text-red-500">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'loading' || !consent}
        className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 cursor-pointer"
      >
        {status === 'loading' ? 'שולח...' : 'קבלו מדריך טעינה חינם'}
      </button>
    </form>
  );
}
