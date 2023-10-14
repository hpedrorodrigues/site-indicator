import browserAPI from 'webextension-polyfill';
import { storage, StorageKey } from '../../../persistence';

const browser = {
  getSites: () => storage.list(),
  resolveAddress: (hostname) =>
    browserAPI.dns.resolve(hostname).then(({ addresses }) => addresses),
  isExtensionEnabled: async () => {
    const isEnabled = await storage.getKey(StorageKey.IsEnabled);
    return isEnabled === undefined || isEnabled;
  },
};

export default browser;
