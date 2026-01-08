'use client';

import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type NavigationLinkHref = '/' | '/product' | '/brand' | '/blog' | '/contact';

interface NavigationLink {
  href: NavigationLinkHref;
  label: string;
  matchPattern?: RegExp;
}

/**
 * Header Navigation Component
 *
 * Desktop navigation menu with hover states and current page indicator.
 *
 * Accessibility:
 * - Keyboard navigable links
 * - ARIA current for active page
 * - Visible focus indicators
 * - Semantic nav element
 */
export function HeaderNavigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  const navigationLinks: NavigationLink[] = [
    {
      href: '/',
      label: t('home'),
      matchPattern: /^\/$/,
    },
    {
      href: '/product',
      label: t('products'),
      matchPattern: /^\/product/,
    },
    {
      href: '/brand',
      label: t('brands'),
      matchPattern: /^\/brand/,
    },
    {
      href: '/blog',
      label: t('blog'),
      matchPattern: /^\/blog/,
    },
    {
      href: '/contact',
      label: t('contact'),
      matchPattern: /^\/contact/,
    },
  ] as const;

  const isActive = (link: NavigationLink): boolean => {
    if (link.matchPattern) {
      return link.matchPattern.test(pathname);
    }
    return pathname === link.href;
  };

  return (
    <nav
      className="hidden md:flex md:items-center md:gap-1"
      aria-label="Main navigation"
    >
      {navigationLinks.map((link) => {
        const active = isActive(link);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              active
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
