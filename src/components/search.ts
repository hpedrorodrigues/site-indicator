import { Site } from '../persistence';
import { MatchRules } from '../labels';

export const siteMatches = (site: Site, query: string): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return (
    site.label.toLowerCase().includes(normalizedQuery) ||
    MatchRules[site.matchRule].toLowerCase().includes(normalizedQuery) ||
    site.value.toLowerCase().includes(normalizedQuery)
  );
};
