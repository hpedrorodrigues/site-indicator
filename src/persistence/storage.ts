import browser from 'webextension-polyfill';
import { Site } from './site';

export type Key = string;

export type Value<T> = T | undefined;

export enum StorageKey {
  Site = 'site-indicator::site',
  IsEnabled = 'site-indicator::enabled',
}

const computeSiteKey = (id: number): string => `${StorageKey.Site}-${id}`;

const isSiteKey = (key: string): boolean => key.startsWith(StorageKey.Site);

class Storage {
  async list(): Promise<Site[]> {
    console.debug('Listing sites');
    const result = await browser.storage.sync.get(null);
    return Object.entries(result)
      .filter(([key, _]) => isSiteKey(key))
      .map(([_, value]) => value);
  }

  async get(id: number): Promise<Site | undefined> {
    console.debug('Finding site', id);
    const result = await browser.storage.sync.get(computeSiteKey(id));
    return Object.values(result).find((site) => !!site);
  }

  async save(site: Site): Promise<Site> {
    console.debug('Saving site:', site);
    if (!site.id) {
      site.id = Date.now();
    }
    await browser.storage.sync.set({ [computeSiteKey(site.id)]: site });
    return site;
  }

  async delete(id: number): Promise<boolean> {
    console.debug('Deleting site:', id);
    const site = await browser.storage.sync.get(computeSiteKey(id));
    await browser.storage.sync.remove(computeSiteKey(id));
    return !!site;
  }

  async getKey<T>(key: Key): Promise<Value<T>> {
    console.debug('Finding key', key);
    const result = Object.values(await browser.storage.sync.get(key));
    if (result.length === 0) {
      return undefined;
    }

    return result[0];
  }

  async setKey<T>(key: Key, value: Value<T>): Promise<Value<T>> {
    console.debug('Setting key', key, value);
    await browser.storage.sync.set({ [key]: value });
    return value;
  }
}

export default new Storage();
