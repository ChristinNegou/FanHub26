import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; matchId: string };
}): Promise<Metadata> {
  return {
    title: `Match ${params.matchId}`,
  };
}

export default function MatchDetailPage({
  params,
}: {
  params: { locale: string; matchId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Match detail</h1>
    </div>
  );
}
