import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './client';
import type { FormDto } from './types';

export function useGetForm(clubId: string) {
  const [data, setData] = useState<FormDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchForm = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const form = await apiFetch<FormDto>(
          `/clubs/${clubId}/forms`,
          { signal },
        );
        setData(form);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    [clubId],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchForm(controller.signal);
    return () => controller.abort();
  }, [fetchForm]);

  return { data, loading, error, refetch: () => fetchForm() };
}