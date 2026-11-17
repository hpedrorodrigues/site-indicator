import DnsOverHttpResolver from 'dns-over-http-resolver';
import { browser } from '../browser';

const resolver = new DnsOverHttpResolver();

const LocalAddress = {
  Host: 'localhost',
  IPv4: '127.0.0.1',
  IPv6: '::1',
};

type Resolve = (hostname: string) => Promise<string[]>;

const resolve = async (
  hostname: string,
  localAddress: string,
  resolveOverHttps: Resolve
): Promise<string[]> => {
  if (hostname === LocalAddress.Host) {
    return [localAddress];
  }

  const isEnabled = await browser.isDnsOverHttpsEnabled();
  if (!isEnabled) {
    console.debug('DNS over HTTPS is disabled. Not resolving', hostname);
    return [];
  }

  return resolveOverHttps(hostname);
};

const dnsResolver = {
  resolve4: (hostname: string): Promise<string[]> =>
    resolve(hostname, LocalAddress.IPv4, (host) => resolver.resolve4(host)),
  resolve6: (hostname: string): Promise<string[]> =>
    resolve(hostname, LocalAddress.IPv6, (host) => resolver.resolve6(host)),
};

export default dnsResolver;
