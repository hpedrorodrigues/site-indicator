import DnsOverHttpResolver from 'dns-over-http-resolver';
import { browser } from '../browser';

const resolver = new DnsOverHttpResolver();

const LocalAddress = {
  Host: 'localhost',
  IPv4: '127.0.0.1',
  IPv6: '::1',
};

const resolve = async (hostname, localAddress, resolveOverHttps) => {
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
  resolve4: (hostname) =>
    resolve(hostname, LocalAddress.IPv4, (host) => resolver.resolve4(host)),
  resolve6: (hostname) =>
    resolve(hostname, LocalAddress.IPv6, (host) => resolver.resolve6(host)),
};

export default dnsResolver;
