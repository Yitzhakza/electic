'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });
      if (res.ok) trackEvent('lead_form_submit_success', { source: 'newsletter' });
    } catch {
      // Silently fail — still show success for UX
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary rounded-2xl p-10 md:p-12">
      <h3 className="text-2xl font-bold text-white mb-3">
        קבלו עדכונים על דילים חדשים
      </h3>
      <p className="text-white/60 text-sm mb-8">
        הצטרפו לרשימת התפוצה שלנו וקבלו הנחות בלעדיות, מוצרים חדשים וקופונים ישירות למייל.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="כתובת אימייל"
            required
            className="flex-1 border border-white/15 bg-white/10 text-white px-4 py-3.5 text-sm placeholder:text-white/40 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 rounded-lg"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cta text-primary-dark px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-cta-dark transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'שולח...' : 'הרשמה'}
          </button>
        </form>
      ) : (
        <p className="text-success-light font-medium">תודה! נעדכן אותך בקרוב.</p>
      )}
    </div>
  );
}
