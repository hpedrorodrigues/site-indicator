import { useState, useEffect } from 'react';

const DarkSchemeQuery = '(prefers-color-scheme: dark)';

const usePrefersDark = (): boolean => {
  const [prefersDark, setPrefersDark] = useState<boolean>(
    () => window.matchMedia(DarkSchemeQuery).matches
  );

  useEffect(() => {
    const media = window.matchMedia(DarkSchemeQuery);
    const onChange = (event: MediaQueryListEvent) =>
      setPrefersDark(event.matches);

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return prefersDark;
};

export default usePrefersDark;
