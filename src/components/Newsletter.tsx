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
    <div className="bg-gradient-to-bl from-blue-950 via-slate-900 to-slate-900 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold text-white mb-2">
        קבלו עדכונים על דילים חדשים
      </h3>
      <p className="text-gray-300 text-sm mb-6">
        הצטרפו לרשימת התפוצה שלנו וקבלו הנחות בלעדיות, מוצרים חדשים וקופונים ישירות למייל.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="כתובת אימייל"
            required
            className="flex-1 rounded-xl border border-white/20 bg-white/10 text-white px-4 py-3 text-sm placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {loading ? 'שולח...' : 'הרשמה'}
          </button>
        </form>
      ) : (
        <p className="text-green-400 font-medium">תודה! נעדכן אותך בקרוב.</p>
      )}
    </div>
  );
}
