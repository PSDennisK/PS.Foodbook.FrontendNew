import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

import type { Locale } from './config';

interface Messages {
  [key: string]: string | Messages;
}

/**
 * next-intl request configuration
 * Loads messages dynamically based on the current locale
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)) as {
    default: Messages;
  };

  return {
    locale,
    messages: messages.default,
  };
});
