import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { cities } from '@/data/cities';

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://fan-hub26.vercel.app').replace(/\/$/, '');
const locales = ['fr', 'en'];

function staticRoutes(): MetadataRoute.Sitemap {
  const paths = ['', '/watch', '/calendar', '/guide', '/fanzones', '/community', '/about', '/contact'];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : path === '/watch' ? 0.9 : 0.7,
      });
    }
    for (const city of cities) {
      entries.push({
        url: `${BASE_URL}/${locale}/guide/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let barEntries: MetadataRoute.Sitemap = [];

  try {
    const supabase = createClient();
    const { data: bars } = await supabase
      .from('bars')
      .select('slug, updated_at')
      .eq('is_active', true);

    for (const bar of bars ?? []) {
      for (const locale of locales) {
        barEntries.push({
          url: `${BASE_URL}/${locale}/bar/${bar.slug}`,
          lastModified: new Date(bar.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // DB unavailable — return static routes only
  }

  return [...staticRoutes(), ...barEntries];
}
