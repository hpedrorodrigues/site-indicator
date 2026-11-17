import { storage, StorageKey } from '../../../persistence';

const browser = {
  getSites: () => storage.list(),
  isExtensionEnabled: async () => {
    const isEnabled = await storage.getKey(StorageKey.IsEnabled);
    return isEnabled === undefined || isEnabled;
  },
  isDnsOverHttpsEnabled: async () => {
    const isEnabled = await storage.getKey(StorageKey.DnsOverHttps);
    return isEnabled === true;
  },
};

export default browser;
