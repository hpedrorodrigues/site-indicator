import { isSiteEnabled, sortByPriority } from '../../persistence';
import { favicon, indicator, browser, ruleMatcher, title } from '../modules';

const url = window.location.href;

browser.getSites().then(async (sites) => {
  console.debug('Loaded sites', sites);

  const isExtensionEnabled = await browser.isExtensionEnabled();
  if (!isExtensionEnabled) {
    console.debug(
      'Content script will not be run since extension is disabled.'
    );
    return;
  }

  for (const site of sortByPriority(sites.filter(isSiteEnabled))) {
    const isMatch = await ruleMatcher.match(url, site).catch(console.error);
    if (isMatch) {
      indicator.insertOnPage(site);
      favicon.updateOnPage(site);
      title.updateOnPage(site);
      return;
    }
  }
});
