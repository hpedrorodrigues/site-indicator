import browser from 'webextension-polyfill';
import { Site } from './site';

class Storage {
  async list(): Promise<Site[]> {
    console.debug('Listing sites');
    const result = await browser.storage.sync.get(null);
    return Object.values(result);
  }

  async get(id: number): Promise<Site | undefined> {
    console.debug('Finding site', id);
    const result = await browser.storage.sync.get(`${id}`);
    return Object.values(result).find((site) => !!site);
  }

  async save(site: Site): Promise<Site> {
    console.debug('Saving site:', site);
    if (!site.id) {
      site.id = Date.now();
    }
    await browser.storage.sync.set({ [`${site.id}`]: site });
    return site;
  }

  async delete(id: number): Promise<boolean> {
    console.debug('Deleting site:', id);
    const site = await browser.storage.sync.get(`${id}`);
    await browser.storage.sync.remove(`${id}`);
    return !!site;
  }
}

export default new Storage();
