import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos — FanHub26',
  description: 'FanHub26 — La plateforme bilingue FR/EN pour les fans de la Coupe du Monde FIFA 2026 au Canada.',
};

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">
        {locale === 'fr' ? 'À propos de FanHub26' : 'About FanHub26'}
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        {locale === 'fr'
          ? 'FanHub26 est la plateforme bilingue pour les fans de la Coupe du Monde FIFA 2026 au Canada.'
          : 'FanHub26 is the bilingual platform for FIFA World Cup 2026 fans in Canada.'}
      </p>
    </div>
  );
}
