import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; teamSlug: string };
}): Promise<Metadata> {
  const teamName = params.teamSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Communauté ${teamName} au Canada`,
    description: `Rejoignez les fans de ${teamName} au Canada pour la Coupe du Monde 2026.`,
  };
}

export default function TeamCommunityPage({
  params,
}: {
  params: { locale: string; teamSlug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.teamSlug.replace(/-/g, ' ')}</h1>
    </div>
  );
}
