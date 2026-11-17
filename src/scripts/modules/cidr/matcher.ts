import ipaddr from 'ipaddr.js';

const cidrMatcher = {
  getIPv4: (host: string): string | null =>
    ipaddr.IPv4.isIPv4(host) ? host : null,
  getIPv6: (host: string): string | null =>
    ipaddr.IPv6.isIPv6(host) ? host : null,
  match: (cidr: string, ip: string): boolean => {
    console.debug('Parsing CIDR and IP', cidr, ip);
    const address = ipaddr.parse(ip);
    return address.match(ipaddr.parseCIDR(cidr));
  },
};

export default cidrMatcher;
