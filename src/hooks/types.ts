export type QueryParams<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export type QueryHook<T> = {
  data: T;
  isLoading: boolean;
  error?: Error;
  reload: () => void;
};

export type MutationParams<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export type MutationHook = {
  isLoading: boolean;
  mutate: (...params: any) => void;
};
