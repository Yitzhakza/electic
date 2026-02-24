import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EV אביזרים - אביזרים לרכבים חשמליים בישראל',
    template: '%s | EV אביזרים',
  },
  description:
    'האתר המוביל בישראל לאביזרים לרכבים חשמליים. שטיחים, מגני מסך, מטענים, מחזיקי טלפון ועוד - לטסלה, BYD, MG ולכל הרכבים החשמליים.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il'),
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'EV אביזרים',
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EV אביזרים',
  url: SITE_URL,
  description: 'האתר המוביל בישראל לאביזרים לרכבים חשמליים. שטיחים, מגני מסך, מטענים ועוד - לטסלה, BYD, MG ולכל הרכבים החשמליים.',
  inLanguage: 'he',
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EV אביזרים',
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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
