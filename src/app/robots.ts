import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhub26.ca';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/fr/bar/dashboard', '/en/bar/dashboard'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
