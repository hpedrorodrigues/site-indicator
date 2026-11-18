import { getTarget, type Site, Target } from './site';

export type PageAddress = {
  domain: string;
  host: string;
  path: string;
};

const decodePath = (path: string): string => {
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
};

export const getPageAddress = (
  url: string | undefined
): PageAddress | undefined => {
  if (!url) {
    return undefined;
  }
  try {
    const { protocol, hostname, host, pathname } = new URL(url);
    if (protocol !== 'http:' && protocol !== 'https:') {
      return undefined;
    }
    const path = decodePath(pathname).replace(/\/+$/, '');
    return { domain: hostname, host, path: `${host}${path}`.toLowerCase() };
  } catch {
    return undefined;
  }
};

export const targetOf = (address: PageAddress, site: Site): string => {
  switch (getTarget(site)) {
    case Target.Domain:
      return address.domain;
    case Target.Host:
      return address.host;
    case Target.Path:
      return address.path;
  }
};
