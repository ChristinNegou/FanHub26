import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communauté fans — FanHub26',
  description: 'Rejoignez la communauté de fans de votre équipe favorite au Canada pour la Coupe du Monde 2026.',
};

export default function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {locale === 'fr' ? 'Communauté' : 'Community'}
      </h1>
    </div>
  );
}
