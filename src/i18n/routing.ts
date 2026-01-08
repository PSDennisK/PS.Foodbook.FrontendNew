import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

import { locales, defaultLocale } from './config';

/**
 * next-intl routing configuration
 * Defines localized pathnames and navigation behavior
 */
export const routing = defineRouting({
  // All available locales
  locales,

  // Default locale
  defaultLocale,

  // Always show locale prefix in URL (e.g., /nl/product instead of /product)
  localePrefix: 'always',

  // Localized pathnames
  pathnames: {
    '/': '/',

    '/product': '/product',

    '/product/[id]': '/product/[id]',

    '/brand/[id]': {
      nl: '/merk/[id]',
      en: '/brand/[id]',
      de: '/marke/[id]',
      fr: '/marque/[id]',
    },

    '/blog': '/blog',

    '/blog/[slug]': '/blog/[slug]',

    '/contact': {
      nl: '/contact',
      en: '/contact',
      de: '/kontakt',
      fr: '/contact',
    },
  },
});

/**
 * Type-safe navigation helpers
 * Use these instead of Next.js' built-in navigation
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/**
 * Export routing type for use in other files
 */
export type Pathnames = keyof typeof routing.pathnames;
