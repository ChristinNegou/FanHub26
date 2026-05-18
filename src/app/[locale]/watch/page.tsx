import { WatchClient } from '@/components/watch/WatchClient';

export default function WatchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { matchId?: string };
}) {
  return <WatchClient locale={locale} initialMatchId={searchParams.matchId ?? null} />;
}
