import ipaddr from 'ipaddr.js';
import { getTarget, MatchRule, type Site, Target } from './site';

const HostnameLabel = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const HostnameCharacters = /^[a-z0-9.-]+$/;
const HostCharacters = /^[a-z0-9.:-]+$/;
const PathCharacters = /^[^\s?#]+$/;
const PathSegment = /^[^\s/?#]+$/;
const Port = /^[1-9][0-9]{0,4}$/;
const MaxPort = 65_535;

export type ValueRule = Pick<Site, 'matchRule' | 'target'>;

const stripScheme = (value: string): string =>
  value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');

const stripUserInfo = (host: string): string => host.replace(/^[^@]*@/, '');

const stripPort = (host: string): string => host.replace(/:\d+$/, '');

const stripTrailingDot = (host: string): string =>
  host.replace(/\.(?=(:\d+)?$)/, '');

const stripTrailingSlash = (path: string): string => path.replace(/\/+$/, '');

const normalizeAddress = (rule: ValueRule, value: string): string => {
  const [hostAndPath] = stripScheme(value.trim().toLowerCase()).split(/[?#]/);
  const [rawHost, ...segments] = hostAndPath.split('/');
  const host = stripUserInfo(rawHost);
  const hostname =
    rule.matchRule === MatchRule.StartsWith ? host : stripTrailingDot(host);
  switch (getTarget(rule)) {
    case Target.Domain:
      return stripPort(hostname);
    case Target.Host:
      return hostname;
    case Target.Path:
      return stripTrailingSlash([hostname, ...segments].join('/'));
  }
};

const normalizeWords = (value: string): string =>
  value
    .split(',')
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word !== '')
    .join(',');

const normalizeCidr = (
  family: typeof ipaddr.IPv4 | typeof ipaddr.IPv6,
  value: string
): string => {
  const cidr = value.trim();
  if (!family.isValidCIDR(cidr)) {
    return cidr;
  }
  const [, prefix] = family.parseCIDR(cidr);
  return `${family.networkAddressFromCIDR(cidr).toString()}/${prefix}`;
};

const isRegExp = (value: string): boolean => {
  try {
    new RegExp(value, 'iu');
    return true;
  } catch {
    return false;
  }
};

const isValidHostname = (hostname: string): boolean =>
  hostname.split('.').every((label) => HostnameLabel.test(label));

const isValidHost = (host: string): boolean => {
  const [hostname, port, ...rest] = host.split(':');
  const isValidPort =
    port === undefined || (Port.test(port) && Number(port) <= MaxPort);
  return rest.length === 0 && isValidHostname(hostname) && isValidPort;
};

const isValidPath = (path: string): boolean => {
  const [host, ...segments] = path.split('/');
  return (
    isValidHost(host) && segments.every((segment) => PathSegment.test(segment))
  );
};

const isValidExact = (target: Target, value: string): boolean => {
  switch (target) {
    case Target.Domain:
      return isValidHostname(value);
    case Target.Host:
      return isValidHost(value);
    case Target.Path:
      return isValidPath(value);
  }
};

const isValidPartial = (target: Target, value: string): boolean => {
  switch (target) {
    case Target.Domain:
      return HostnameCharacters.test(value);
    case Target.Host:
      return HostCharacters.test(value);
    case Target.Path:
      return PathCharacters.test(value);
  }
};

export const normalizeValue = (rule: ValueRule, value: string): string => {
  switch (rule.matchRule) {
    case MatchRule.Exact:
    case MatchRule.StartsWith:
    case MatchRule.EndsWith:
      return normalizeAddress(rule, value);
    case MatchRule.ContainsWords:
      return normalizeWords(value);
    case MatchRule.RegEx:
      return value.trim();
    case MatchRule.CidrV4:
      return normalizeCidr(ipaddr.IPv4, value);
    case MatchRule.CidrV6:
      return normalizeCidr(ipaddr.IPv6, value);
  }
};

export const isValidValue = (rule: ValueRule, value: string): boolean => {
  const normalized = normalizeValue(rule, value);
  switch (rule.matchRule) {
    case MatchRule.Exact:
      return isValidExact(getTarget(rule), normalized);
    case MatchRule.StartsWith:
    case MatchRule.EndsWith:
      return isValidPartial(getTarget(rule), normalized);
    case MatchRule.ContainsWords:
      return normalized !== '';
    case MatchRule.RegEx:
      return normalized !== '' && isRegExp(normalized);
    case MatchRule.CidrV4:
      return ipaddr.IPv4.isValidCIDR(normalized);
    case MatchRule.CidrV6:
      return ipaddr.IPv6.isValidCIDR(normalized);
  }
};
