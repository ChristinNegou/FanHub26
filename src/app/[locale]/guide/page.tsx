import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide des villes',
  description: 'Guide complet des villes hôtes de la Coupe du Monde 2026 au Canada : transport, restaurants, hôtels, activités.',
};

export default function GuidePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {locale === 'fr' ? 'Guide des villes' : 'City guide'}
      </h1>
    </div>
  );
}
