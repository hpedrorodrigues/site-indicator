import { useState, useCallback } from 'react';
import { storage, Key, Value } from '../persistence';
import { MutationHook, MutationParams } from './types';

const useSaveItem = <T>({
  onSuccess,
  onError,
}: MutationParams<Value<T>>): MutationHook => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const mutate = useCallback(
    (key: Key, value: Value<T>) => {
      setLoading(true);

      storage
        .setKey<T>(key, value)
        .then(onSuccess)
        .catch(onError)
        .finally(() => setLoading(false));
    },
    [onSuccess, onError]
  );

  return { mutate, isLoading };
};

export default useSaveItem;
