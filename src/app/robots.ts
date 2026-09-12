import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://staysafeandbrave.de';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/dashboard/*',
          '/admin',
          '/admin/',
          '/admin/*',
          '/mentor/messages',
          '/mentor/messages/',
          '/mentor/messages/*',
          '/auth',
          '/auth/',
          '/auth/*',
          '/booking',
          '/warenkorb',
          '/bezahlen',
          '/buchung-bestaetigt',
          '/reiseberichte',
          '/api/',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
