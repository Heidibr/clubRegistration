import { useState, useCallback } from 'react';
import { apiFetch } from './client';
import type { UserRegistration, RegistrationDto } from './types';

export function useRegister(clubId: string, formId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = useCallback(
    async (registration: UserRegistration): Promise<RegistrationDto> => {
      setLoading(true);
      setError(null);
      try {
        return await apiFetch<RegistrationDto>(
          `/clubs/${clubId}/forms/${formId}/registrations`,
          { method: 'POST', body: JSON.stringify(registration) },
        );
      } catch (e) {
        setError(e as Error);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [clubId, formId],
  );

  return { register, loading, error };
}