import { ribbon, browser, ruleMatcher, util } from '../modules';

const domain = util.getDomain(window.location.host);

browser.getSites().then(async (sites) => {
  console.debug('Loaded sites', sites);

  for (const site of sites) {
    if (await ruleMatcher.match(domain, site).catch(console.error)) {
      ribbon.insertOnPage(site);
    }
  }
});
