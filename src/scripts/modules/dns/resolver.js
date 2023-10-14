import DnsOverHttpResolver from 'dns-over-http-resolver';
import { browser } from '../browser';

const resolver = new DnsOverHttpResolver();

const LocalAddress = {
  Host: 'localhost',
  IPv4: '127.0.0.1',
  IPv6: '::1',
};

const dnsResolver = {
  resolve4: (hostname) => {
    if (hostname === LocalAddress.Host) {
      return [LocalAddress.IPv4];
    }

    try {
      return browser.resolveAddress(hostname);
    } catch (e) {
      console.debug(
        'Error resolving address v4 using browser API. Falling back to HTTP...',
        e
      );
      return resolver.resolve4(hostname);
    }
  },
  resolve6: (hostname) => {
    if (hostname === LocalAddress.Host) {
      return [LocalAddress.IPv6];
    }

    try {
      return browser.resolveAddress(hostname);
    } catch (e) {
      console.debug(
        'Error resolving address v6 using browser API. Falling back to HTTP...',
        e
      );
      return resolver.resolve6(hostname);
    }
  },
};

export default dnsResolver;
