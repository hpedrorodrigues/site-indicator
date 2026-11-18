import {
  getPageAddress,
  MatchRule,
  type Site,
  targetOf,
} from '../../../persistence';
import { cidrMatcher } from '../cidr';
import { dnsResolver } from '../dns';

type Operation = (target: string, value: string) => boolean;

const isMatch = (
  target: string,
  value: string,
  operation: Operation
): boolean => {
  if (target.startsWith('www.') && !value.startsWith('www.')) {
    return operation(target, `www.${value}`);
  }

  if (!target.startsWith('www.') && value.startsWith('www.')) {
    return operation(`www.${target}`, value);
  }

  return operation(target, value);
};

const isExactMatch = (target: string, value: string): boolean =>
  isMatch(target, value, (target, value) => target === value);

const isContainsWordsMatch = (target: string, value: string): boolean =>
  value.split(',').some((word) => target.includes(word.toLowerCase()));

const isStartsWithMatch = (target: string, value: string): boolean =>
  isMatch(target, value, (target, value) => target.startsWith(value));

const isEndsWithMatch = (target: string, value: string): boolean =>
  isMatch(target, value, (target, value) => target.endsWith(value));

const isCidr4Match = async (
  domain: string,
  value: string
): Promise<boolean> => {
  console.debug('[start] Checking CIDR v4 rule', domain, value);
  const ipv4 = cidrMatcher.getIPv4(domain);
  const ips = ipv4 ? [ipv4] : await dnsResolver.resolve4(domain);
  const result = ips.some((ip) => cidrMatcher.match(value, ip));
  console.debug('[end] Checking CIDR v4 rule', ips, result);
  return result;
};

const isCidr6Match = async (
  domain: string,
  value: string
): Promise<boolean> => {
  console.debug('[start] Checking CIDR v6 rule', domain, value);
  const ipv6 = cidrMatcher.getIPv6(domain);
  const ips = ipv6 ? [ipv6] : await dnsResolver.resolve6(domain);
  const result = ips.some((ip) => cidrMatcher.match(value, ip));
  console.debug('[end] Checking CIDR v6 rule', ips, result);
  return result;
};

const ruleMatcher = {
  match: async (url: string, site: Site): Promise<boolean> => {
    const address = getPageAddress(url);
    if (!address) {
      return false;
    }
    const target = targetOf(address, site);
    console.debug('Checking address', target, site);
    switch (site.matchRule) {
      case MatchRule.Exact:
        return isExactMatch(target, site.value);
      case MatchRule.ContainsWords:
        return isContainsWordsMatch(target, site.value);
      case MatchRule.StartsWith:
        return isStartsWithMatch(target, site.value);
      case MatchRule.EndsWith:
        return isEndsWithMatch(target, site.value);
      case MatchRule.RegEx:
        return RegExp(site.value, 'iu').test(target);
      case MatchRule.CidrV4:
        return await isCidr4Match(address.domain, site.value);
      case MatchRule.CidrV6:
        return await isCidr6Match(address.domain, site.value);
      default:
        return false;
    }
  },
};

export default ruleMatcher;
