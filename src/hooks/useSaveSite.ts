import { useState, useCallback } from 'react';
import { storage, Site } from '../persistence';
import { MutationHook, MutationParams } from './types';

const useSaveSite = ({
  onSuccess,
  onError,
}: MutationParams<Site> = {}): MutationHook<Site> => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const mutate = useCallback(
    (site: Site) => {
      setLoading(true);

      storage
        .save(site)
        .then(onSuccess)
        .catch(onError)
        .finally(() => setLoading(false));
    },
    [onSuccess, onError]
  );

  return { mutate, isLoading };
};

export default useSaveSite;
