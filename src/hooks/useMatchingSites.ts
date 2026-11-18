import { useState, useEffect } from 'react';
import { isSiteEnabled, type Site } from '../persistence';
import { ruleMatcher } from '../scripts/modules/rule';

type MatchingSitesParams = {
  sites: Site[];
  domain?: string;
};

type MatchingSitesHook = {
  data: Site[];
  isLoading: boolean;
};

const useMatchingSites = ({
  sites,
  domain,
}: MatchingSitesParams): MatchingSitesHook => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<Site[]>([]);

  useEffect(() => {
    if (!domain) {
      setMatches([]);
      return;
    }

    const candidates = sites.filter(isSiteEnabled);
    let isCurrent = true;
    setLoading(true);

    Promise.all(
      candidates.map((site) =>
        ruleMatcher.match(domain, site).catch(() => false)
      )
    )
      .then((results) => {
        if (isCurrent) {
          setMatches(candidates.filter((_, index) => results[index]));
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [sites, domain]);

  return {
    data: matches,
    isLoading,
  };
};

export default useMatchingSites;
