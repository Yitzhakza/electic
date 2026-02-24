'use client';

import { useEffect, useState, useCallback } from 'react';
import LeadCaptureForm from './LeadCaptureForm';
import { trackEvent } from '@/lib/analytics';

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('lead_modal_shown')) return;
    setIsOpen(true);
    if (typeof window !== 'undefined') sessionStorage.setItem('lead_modal_shown', '1');
    trackEvent('lead_form_open', { trigger: 'modal' });
  }, []);

  useEffect(() => {
    (window as any).__openLeadModal = () => {
      setIsOpen(true);
      trackEvent('lead_form_open', { trigger: 'manual' });
    };
    return () => { delete (window as any).__openLeadModal; };
  }, []);

  // Exit intent (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5) openModal();
    };
    document.addEventListener('mouseout', handler);
    return () => document.removeEventListener('mouseout', handler);
  }, [openModal]);

  // Scroll trigger (mobile only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    const handler = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0 && window.scrollY / scrollHeight >= 0.5) {
        openModal();
        window.removeEventListener('scroll', handler);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [openModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-10">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 end-4 text-muted hover:text-text cursor-pointer">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-text">מדריך טעינה ביתית חינם</h2>
          <p className="text-muted text-sm">קבלו מדריך מקיף על טעינה ביתית לרכב חשמלי בישראל — סוגי מטענים, עלויות ודגשים חשובים.</p>
        </div>
        <LeadCaptureForm source="modal" onSuccess={() => {}} />
      </div>
    </div>
  );
}
