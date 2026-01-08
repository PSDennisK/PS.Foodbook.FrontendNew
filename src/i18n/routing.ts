import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

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

    '/brand': {
      nl: '/merk',
      en: '/brand',
      de: '/marke',
      fr: '/marque',
    },

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

    '/login': '/login',

    '/logout': '/logout',

    '/account': '/account',

    '/orders': '/orders',

    '/settings': '/settings',

    '/privacy': {
      nl: '/privacy',
      en: '/privacy',
      de: '/datenschutz',
      fr: '/confidentialite',
    },

    '/terms': {
      nl: '/algemene-voorwaarden',
      en: '/terms',
      de: '/agb',
      fr: '/conditions',
    },

    '/cookies': {
      nl: '/cookies',
      en: '/cookies',
      de: '/cookies',
      fr: '/cookies',
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
