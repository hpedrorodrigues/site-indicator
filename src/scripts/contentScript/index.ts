import type { Site } from '../../persistence';
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

  const matches: Site[] = [];
  for (const site of sites) {
    const isMatch = await ruleMatcher.match(domain, site).catch(console.error);
    if (isMatch) {
      matches.push(site);
    }
  }

  const site = matches.at(-1);
  if (!site) {
    return;
  }

  indicator.insertOnPage(site);
  favicon.updateOnPage(site);
  title.updateOnPage(site);
});
