'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-border/40 shadow-[0_-4px_20px_rgb(0,0,0,0.06)]">
      <div className="flex gap-2 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href="https://wa.me/972557258823?text=שלום, אשמח לקבל ייעוץ לאביזרים לרכב חשמלי"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-medium text-sm"
          onClick={() => trackEvent('whatsapp_click', { source: 'sticky_cta' })}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          וואטסאפ
        </a>
        <button
          className="flex-1 inline-flex items-center justify-center gap-2 bg-cta text-primary-dark py-3 rounded-lg font-semibold text-sm cursor-pointer"
          onClick={() => {
            trackEvent('guide_download_click', { source: 'sticky_cta' });
            (window as any).__openLeadModal?.();
          }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          מדריך חינם
        </button>
      </div>
    </div>
  );
}
