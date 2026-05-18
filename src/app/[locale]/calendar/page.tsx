import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendrier des matchs',
  description: 'Tous les 104 matchs de la Coupe du Monde 2026 avec horaires en fuseau horaire canadien.',
};

export default function CalendarPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {locale === 'fr' ? 'Calendrier des matchs' : 'Match calendar'}
      </h1>
    </div>
  );
}
