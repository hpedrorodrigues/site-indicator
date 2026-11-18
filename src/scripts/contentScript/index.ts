import { isSiteEnabled, sortByPriority } from '../../persistence';
import {
  favicon,
  indicator,
  browser,
  ruleMatcher,
  title,
  util,
} from '../modules';

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

  for (const site of sortByPriority(sites.filter(isSiteEnabled))) {
    const isMatch = await ruleMatcher.match(domain, site).catch(console.error);
    if (isMatch) {
      indicator.insertOnPage(site);
      favicon.updateOnPage(site);
      title.updateOnPage(site);
      return;
    }
  }
});
