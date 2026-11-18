import { useState, useEffect, useCallback } from 'react';
import browser from 'webextension-polyfill';
import type { QueryHook } from './types';

const useActiveTabUrl = (): QueryHook<string | undefined> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [refreshId, setRefreshId] = useState<number>(0);

  const reload = useCallback(() => setRefreshId(Date.now()), [setRefreshId]);

  useEffect(() => {
    setLoading(true);

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => setUrl(tabs[0]?.url))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshId]);

  return {
    data: url,
    isLoading,
    error,
    reload,
  };
};

export default useActiveTabUrl;
