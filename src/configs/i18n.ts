import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from '@/i18n-config';

export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: never,
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string) =>
          import(`../../public/dictionaries/${language}.json`),
      ),
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: { [locale]: i18nInstance.services.resourceStore.data[locale] },
    t: i18nInstance.t,
  };
}

export const LANGUAGE_OPTIONS = [
  {
    lang: 'Tiếng Việt',
    value: 'vi',
  },
  {
    lang: 'English',
    value: 'en',
  },
  {
    lang: '中文 (Chinese)',
    value: 'cn',
  },
  {
    lang: '한국어 (Korean)',
    value: 'kr',
  },
];

export const LANGUAGE_MAP = LANGUAGE_OPTIONS.flatMap((lang) => lang.value);
