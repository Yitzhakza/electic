// Type-safe event names
export type AnalyticsEvent =
  | 'lead_form_open'
  | 'lead_form_submit_success'
  | 'lead_form_submit_error'
  | 'whatsapp_click'
  | 'guide_download_click'
  | 'comparison_table_click'
  | 'scroll_depth_50'
  | 'cta_click'
  | 'ab_test_exposure';

export function trackEvent(name: AnalyticsEvent, params?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', name, params);
  }
}

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}
