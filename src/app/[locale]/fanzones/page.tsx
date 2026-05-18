import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fan zones — Coupe du Monde 2026 Canada',
  description: 'Toutes les fan zones officielles et communautaires de la Coupe du Monde 2026 au Canada.',
};

export default function FanZonesPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {locale === 'fr' ? 'Fan zones' : 'Fan zones'}
      </h1>
    </div>
  );
}
