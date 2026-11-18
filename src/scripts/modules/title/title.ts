import type { Site } from '../../../persistence';

const Separator = ' ';

const hasPrefix = (prefix: string, title: string): boolean =>
  title === prefix || title.startsWith(`${prefix}${Separator}`);

const updateTitle = (site: Site): void => {
  const prefix = site.titlePrefix?.trim();
  if (!prefix || !document.head) {
    return;
  }

  const apply = () => {
    if (!hasPrefix(prefix, document.title)) {
      document.title = `${prefix}${Separator}${document.title}`;
    }
  };

  apply();
  new MutationObserver(apply).observe(document.head, {
    childList: true,
    characterData: true,
    subtree: true,
  });
};

const title = { updateOnPage: updateTitle };

export default title;
