'use client';

import { useTransition } from 'react';

import { useParams } from 'next/navigation';

import { Check, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/routing';

/**
 * Language Switcher Component
 *
 * Allows users to switch between available locales while
 * maintaining their current page location.
 *
 * Accessibility:
 * - Keyboard navigable dropdown
 * - ARIA labels for screen readers
 * - Visual indicator for current language
 * - Focus management via Radix UI
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = (params['locale'] as Locale | undefined) ?? 'nl';

  const handleLocaleChange = (locale: Locale) => {
    startTransition(() => {
      // @ts-expect-error - router.replace type is too strict for dynamic pathnames
      router.replace(pathname, { locale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={isPending}
          aria-label="Change language"
        >
          <Globe className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">
            {localeNames[currentLocale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => { handleLocaleChange(locale); }}
            className="gap-2"
            aria-current={locale === currentLocale ? 'true' : undefined}
          >
            <Check
              className="size-4"
              style={{
                opacity: locale === currentLocale ? 1 : 0,
              }}
              aria-hidden="true"
            />
            <span>{localeNames[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
