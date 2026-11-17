import { MatchRules } from './labels';
import type { Site } from './persistence';
import { compareText } from './util';

export type SortColumn = 'label' | 'matchRule' | 'value';
export type SortOrder = 'ascend' | 'descend';
export type SiteSort = { column: SortColumn; order: SortOrder };

const columnText = (site: Site, column: SortColumn): string =>
  column === 'matchRule' ? MatchRules[site.matchRule] : site[column];

export const sortSites = (sites: Site[], sort?: SiteSort): Site[] => {
  if (!sort) {
    return sites;
  }
  const direction = sort.order === 'ascend' ? 1 : -1;
  return [...sites].sort(
    (left, right) =>
      direction *
      compareText(columnText(left, sort.column), columnText(right, sort.column))
  );
};

export const filterSites = (sites: Site[], query: string): Site[] => {
  const needle = query.trim().toLowerCase();
  if (needle === '') {
    return sites;
  }
  return sites.filter((site) =>
    [site.label, site.value, MatchRules[site.matchRule]].some((text) =>
      text.toLowerCase().includes(needle)
    )
  );
};
