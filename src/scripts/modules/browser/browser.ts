import { type Site, storage, StorageKey } from '../../../persistence';

const browser = {
  getSites: (): Promise<Site[]> => storage.list(),
  isExtensionEnabled: async (): Promise<boolean> => {
    const isEnabled = await storage.getKey<boolean>(StorageKey.IsEnabled);
    return isEnabled === undefined || isEnabled;
  },
  isDnsOverHttpsEnabled: async (): Promise<boolean> => {
    const isEnabled = await storage.getKey<boolean>(StorageKey.DnsOverHttps);
    return isEnabled === true;
  },
};

export default browser;
