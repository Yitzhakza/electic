import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollDepthTracker from '@/components/ScrollDepthTracker';
import LeadCaptureModal from '@/components/lead/LeadCaptureModal';
import StickyCTA from '@/components/lead/StickyCTA';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EV Shop - אביזרים לרכבים חשמליים בישראל',
    template: '%s | EV Shop',
  },
  description:
    'האתר המוביל בישראל לאביזרים לרכבים חשמליים. שטיחים, מגני מסך, מטענים, מחזיקי טלפון ועוד - לטסלה, BYD, MG ולכל הרכבים החשמליים.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il'),
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'EV Shop',
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EV Shop',
  url: SITE_URL,
  description: 'האתר המוביל בישראל לאביזרים לרכבים חשמליים. שטיחים, מגני מסך, מטענים ועוד - לטסלה, BYD, MG ולכל הרכבים החשמליים.',
  inLanguage: 'he',
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EV Shop',
  url: SITE_URL,
  inLanguage: 'he',
  description: 'אביזרים לרכבים חשמליים בישראל - מחירים משתלמים עם משלוח ישיר',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4_ID}');` }} />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <ScrollDepthTracker />
        <LeadCaptureModal />
        <StickyCTA />
      </body>
    </html>
  );
}
