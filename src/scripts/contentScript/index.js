import { ribbon, browser, ruleMatcher, util } from '../modules';

const domain = util.getDomain(window.location.host);

browser.getSites().then(async (sites) => {
  console.debug('Loaded sites', sites);

  const isExtensionEnabled = await browser.isExtensionEnabled();
  if (!isExtensionEnabled) {
    console.debug(
      'Content script will not be run since extension is disabled.'
    );
    return;
  }

  for (const site of sites) {
    if (await ruleMatcher.match(domain, site).catch(console.error)) {
      ribbon.insertOnPage(site);
    }
  }
});
