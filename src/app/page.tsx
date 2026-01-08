import { redirect } from 'next/navigation';

import { defaultLocale } from '@/i18n/config';

/**
 * Root page
 *
 * With localePrefix: 'always', all routes must include a locale.
 * This page redirects the root path to the default locale.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
