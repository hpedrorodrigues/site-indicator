import { useState, useEffect, useCallback } from 'react';
import { storage, Key, Value } from '../persistence';
import { QueryHook, QueryParams } from './types';

type LoadItemParams<T> = QueryParams<Value<T>> & {
  key?: Key;
};

const useLoadItem = <T>({
  key,
  onSuccess,
  onError,
}: LoadItemParams<T>): QueryHook<Value<T>> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<Value<T>>();
  const [error, setError] = useState<Error | undefined>();
  const [refreshId, setRefreshId] = useState<number>(0);

  const reload = useCallback(() => setRefreshId(Date.now()), [setRefreshId]);

  useEffect(() => {
    if (!key) {
      return;
    }

    setLoading(true);

    storage
      .getKey<T>(key)
      .then((value) => {
        setValue(value);
        onSuccess?.(value);
      })
      .catch((error) => {
        setError(error);
        onError?.(error);
      })
      .finally(() => setLoading(false));
  }, [key, refreshId]);

  return {
    data: value,
    isLoading,
    error,
    reload,
  };
};

export default useLoadItem;
