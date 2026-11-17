import { useState, useCallback } from 'react';
import { storage, type Site } from '../persistence';
import type { MutationHook, MutationParams } from './types';

const useSaveSites = ({
  onSuccess,
  onError,
}: MutationParams<Site[]> = {}): MutationHook => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const mutate = useCallback(
    (sites: Site[]) => {
      setLoading(true);

      storage
        .saveAll(sites)
        .then(onSuccess)
        .catch(onError)
        .finally(() => setLoading(false));
    },
    [onSuccess, onError]
  );

  return { mutate, isLoading };
};

export default useSaveSites;
