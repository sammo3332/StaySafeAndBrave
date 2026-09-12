import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://staysafeandbrave.de';
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/mentors', changeFrequency: 'daily', priority: 0.9 },
    { path: '/stories', changeFrequency: 'daily', priority: 0.85 },
    { path: '/pakete-preise', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/travel-assistant', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/ueber-uns', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/sicherheitsrichtlinien', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/kontakt', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/impressum', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/datenschutz', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/agb', changeFrequency: 'yearly', priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
