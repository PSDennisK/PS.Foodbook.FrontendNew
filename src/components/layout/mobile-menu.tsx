'use client';

import { useState } from 'react';

import { usePathname } from 'next/navigation';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type NavigationLinkHref = '/' | '/product' | '/brand' | '/blog' | '/contact';

interface NavigationLink {
  href: NavigationLinkHref;
  label: string;
  matchPattern?: RegExp;
}

/**
 * Mobile Menu Component
 *
 * Full-screen slide-out navigation menu for mobile devices.
 * Uses shadcn Sheet component with focus trap and accessibility features.
 *
 * Accessibility:
 * - Focus trap when open
 * - Keyboard navigation (Escape to close)
 * - ARIA labels for screen readers
 * - Auto-closes on navigation
 * - Visible focus indicators
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
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

  const handleLinkClick = () => {
    // Close menu when navigating
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label={open ? t('closeMenu') : t('menu')}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>{t('menu')}</SheetTitle>
        </SheetHeader>
        <nav
          className="mt-8 flex flex-col gap-2"
          aria-label="Mobile navigation"
        >
          {navigationLinks.map((link) => {
            const active = isActive(link);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  'rounded-md px-4 py-3 text-base font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
