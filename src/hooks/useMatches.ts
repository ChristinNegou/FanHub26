'use client';

import { useState, useEffect } from 'react';
import type { MatchWithTeams } from '@/lib/types/match';

export function useMatches() {
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/matches')
      .then((r) => r.json())
      .then((data) => setMatches(data.matches ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { matches, loading, error };
}
