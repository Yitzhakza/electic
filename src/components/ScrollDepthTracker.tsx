'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function ScrollDepthTracker() {
  useEffect(() => {
    if (sessionStorage.getItem('scroll_50_fired')) return;
    const handler = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= 0.5) {
        trackEvent('scroll_depth_50');
        sessionStorage.setItem('scroll_50_fired', '1');
        window.removeEventListener('scroll', handler);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return null;
}
