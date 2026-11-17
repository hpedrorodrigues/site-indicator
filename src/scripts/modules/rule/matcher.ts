import { MatchRule, type Site } from '../../../persistence';
import { cidrMatcher } from '../cidr';
import { dnsResolver } from '../dns';

type Operation = (domain: string, value: string) => boolean;

const isMatch = (
  domain: string,
  value: string,
  operation: Operation
): boolean => {
  if (domain.startsWith('www.') && !value.startsWith('www.')) {
    return operation(domain, `www.${value}`);
  }

  if (!domain.startsWith('www.') && value.startsWith('www.')) {
    return operation(`www.${domain}`, value);
  }

  return operation(domain, value);
};

const isExactMatch = (domain: string, value: string): boolean =>
  isMatch(domain, value, (domain, value) => domain === value);

const isContainsWordsMatch = (domain: string, value: string): boolean =>
  value.split(',').some((word) => domain.includes(word.toLowerCase()));

const isStartsWithMatch = (domain: string, value: string): boolean =>
  isMatch(domain, value, (domain, value) => domain.startsWith(value));

const isEndsWithMatch = (domain: string, value: string): boolean =>
  isMatch(domain, value, (domain, value) => domain.endsWith(value));

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
  match: async (domain: string, site: Site): Promise<boolean> => {
    console.debug('Checking domain', domain, site);
    switch (site.matchRule) {
      case MatchRule.Exact:
        return isExactMatch(domain, site.value);
      case MatchRule.ContainsWords:
        return isContainsWordsMatch(domain, site.value);
      case MatchRule.StartsWith:
        return isStartsWithMatch(domain, site.value);
      case MatchRule.EndsWith:
        return isEndsWithMatch(domain, site.value);
      case MatchRule.RegEx:
        return RegExp(site.value, 'iu').test(domain);
      case MatchRule.CidrV4:
        return await isCidr4Match(domain, site.value);
      case MatchRule.CidrV6:
        return await isCidr6Match(domain, site.value);
      default:
        return false;
    }
  },
};

export default ruleMatcher;
