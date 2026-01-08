/**
 * i18n Configuration
 * Defines available locales and default locale for the application
 */

export const locales = ['nl', 'en', 'de', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'nl';

/**
 * Locale display names for language switcher
 */
export const localeNames: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
};

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
