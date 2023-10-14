import { useState, useEffect, useCallback } from 'react';
import { storage, Site } from '../persistence';
import { QueryHook, QueryParams } from './types';

type LoadSiteParams = QueryParams<Site | undefined> & {
  siteId?: number;
};

const useLoadSite = ({
  siteId,
  onSuccess,
  onError,
}: LoadSiteParams): QueryHook<Site | undefined> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [site, setSite] = useState<Site | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [refreshId, setRefreshId] = useState<number>(0);

  const reload = useCallback(() => setRefreshId(Date.now()), [setRefreshId]);

  useEffect(() => {
    if (!siteId) {
      return;
    }

    setLoading(true);

    storage
      .get(siteId)
      .then((site) => {
        setSite(site);
        onSuccess?.(site);
      })
      .catch((error) => {
        setError(error);
        onError?.(error);
      })
      .finally(() => setLoading(false));
  }, [siteId, refreshId]);

  return {
    data: site,
    isLoading,
    error,
    reload,
  };
};

export default useLoadSite;
