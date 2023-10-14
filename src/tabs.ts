import browser from 'webextension-polyfill';

const openExtensionTab = async (path: string, queryParams: string = '') => {
  const url = browser.runtime.getURL(path) + queryParams;
  const tabs = await browser.tabs.query({ url });
  if (!tabs || tabs.length === 0) {
    return browser.tabs.create({ url });
  }
  const tab = tabs[0];
  await browser.tabs.highlight({ tabs: tab.index });

  window.close();
};

export const Tabs = <const>{
  openOptionsPage: (queryParams: string = '') =>
    openExtensionTab('options.html', queryParams),
};
