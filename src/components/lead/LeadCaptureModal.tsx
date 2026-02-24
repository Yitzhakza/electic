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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 end-4 text-muted hover:text-gray-900 cursor-pointer">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">מדריך טעינה ביתית חינם</h2>
          <p className="text-muted text-sm">קבלו מדריך מקיף על טעינה ביתית לרכב חשמלי בישראל — סוגי מטענים, עלויות ודגשים חשובים.</p>
        </div>
        <LeadCaptureForm source="modal" onSuccess={() => {}} />
      </div>
    </div>
  );
}
