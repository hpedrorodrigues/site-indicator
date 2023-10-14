const util = {
  getDomain: (host) => {
    const array = host.split(':');
    return !array || array.length === 0 ? '' : array[0];
  },
};

export default util;
