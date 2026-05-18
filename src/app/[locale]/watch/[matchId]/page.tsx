import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; matchId: string };
}): Promise<Metadata> {
  return {
    title: `Match ${params.matchId} — Où regarder`,
  };
}

export default function WatchMatchPage({
  params,
}: {
  params: { locale: string; matchId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {params.locale === 'fr' ? 'Bars pour ce match' : 'Bars showing this match'}
      </h1>
    </div>
  );
}
