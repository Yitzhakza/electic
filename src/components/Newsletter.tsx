'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
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
            className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            הרשמה
          </button>
        </form>
      ) : (
        <p className="text-green-400 font-medium">תודה! נעדכן אותך בקרוב.</p>
      )}
    </div>
  );
}
