import { useState, useEffect, useCallback } from 'react';
import { storage } from '../persistence';
import type { QueryHook } from './types';

const useStorageUsage = (): QueryHook<number> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [bytes, setBytes] = useState<number>(0);
  const [error, setError] = useState<Error | undefined>();
  const [refreshId, setRefreshId] = useState<number>(0);

  const reload = useCallback(() => setRefreshId(Date.now()), [setRefreshId]);

  useEffect(() => {
    setLoading(true);

    storage
      .usage()
      .then(setBytes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshId]);

  return {
    data: bytes,
    isLoading,
    error,
    reload,
  };
};

export default useStorageUsage;
