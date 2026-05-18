import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; citySlug: string };
}): Promise<Metadata> {
  const cityName = params.citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Guide ${cityName} — Coupe du Monde 2026`,
    description: `Guide complet de ${cityName} pour la Coupe du Monde 2026 : transport, restaurants, hôtels, fan zones.`,
  };
}

export default function CityGuidePage({
  params,
}: {
  params: { locale: string; citySlug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.citySlug.replace(/-/g, ' ')}</h1>
    </div>
  );
}
