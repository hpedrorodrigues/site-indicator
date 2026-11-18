import type { Locale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import ptBR from 'antd/locale/pt_BR';
import browser from 'webextension-polyfill';

const locales: Partial<Record<string, Locale>> = {
  en: enUS,
  pt_BR: ptBR,
};

export const getLocale = (): Locale => {
  const language = browser.i18n.getUILanguage().replace('-', '_');
  return locales[language] ?? locales[language.split('_')[0]] ?? enUS;
};
