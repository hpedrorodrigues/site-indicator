import ipaddr from 'ipaddr.js';
import { MatchRule } from './site';

const HostnameLabel = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const HostnameCharacters = /^[a-z0-9.-]+$/;

const normalizeHost = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .split(/[/?#]/)[0]
    .replace(/^[^@]*@/, '')
    .replace(/:\d+$/, '');

const stripTrailingDot = (host: string): string => host.replace(/\.$/, '');

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

export const normalizeValue = (matchRule: MatchRule, value: string): string => {
  switch (matchRule) {
    case MatchRule.Exact:
    case MatchRule.EndsWith:
      return stripTrailingDot(normalizeHost(value));
    case MatchRule.StartsWith:
      return normalizeHost(value);
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

export const isValidValue = (matchRule: MatchRule, value: string): boolean => {
  const normalized = normalizeValue(matchRule, value);
  switch (matchRule) {
    case MatchRule.Exact:
      return normalized.split('.').every((label) => HostnameLabel.test(label));
    case MatchRule.StartsWith:
    case MatchRule.EndsWith:
      return HostnameCharacters.test(normalized);
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
