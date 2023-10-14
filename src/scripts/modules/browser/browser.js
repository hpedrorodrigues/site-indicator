import browserAPI from 'webextension-polyfill';

const browser = {
  getSites: () =>
    browserAPI.storage.sync.get(null).then((result) => Object.values(result)),
  resolveAddress: (hostname) =>
    browserAPI.dns.resolve(hostname).then(({ addresses }) => addresses),
};

export default browser;
