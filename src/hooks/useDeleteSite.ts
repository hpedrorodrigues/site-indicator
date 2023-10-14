import { useState, useCallback } from 'react';
import { storage } from '../persistence';
import { MutationHook, MutationParams } from './types';

const useDeleteSite = ({
  onSuccess,
  onError,
}: MutationParams<boolean> = {}): MutationHook<number> => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const mutate = useCallback(
    (id: number) => {
      setLoading(true);

      storage
        .delete(id)
        .then(onSuccess)
        .catch(onError)
        .finally(() => setLoading(false));
    },
    [onSuccess, onError]
  );

  return { mutate, isLoading };
};

export default useDeleteSite;
