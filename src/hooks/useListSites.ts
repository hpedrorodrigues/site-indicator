import { useState, useEffect, useCallback } from 'react';
import { storage, Site } from '../persistence';
import { QueryHook } from './types';

const useListSites = (): QueryHook<Site[]> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [refreshId, setRefreshId] = useState<number>(0);

  const reload = useCallback(() => setRefreshId(Date.now()), [setRefreshId]);

  useEffect(() => {
    setLoading(true);

    storage
      .list()
      .then(setSites)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshId]);

  return {
    data: sites,
    isLoading,
    error,
    reload,
  };
};

export default useListSites;
