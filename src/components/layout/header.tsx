import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/auth/session';
import { cn } from '@/lib/utils';

import { HeaderNavigation } from './header-navigation';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';
import { UserMenu } from './user-menu';

interface HeaderProps {
  /**
   * Header variant
   * @default 'default'
   */
  variant?: 'default' | 'catalog';
}

/**
 * Header Component
 *
 * Main application header with logo, navigation, user menu, and language switcher.
 * Responsive design with desktop navigation and mobile hamburger menu.
 *
 * Features:
 * - Sticky header with backdrop blur
 * - Responsive navigation (desktop/mobile)
 * - User authentication state
 * - Language switching
 * - WCAG 2.1 AA compliant
 *
 * Accessibility:
 * - Skip to content link
 * - Semantic HTML5 structure
 * - ARIA landmarks
 * - Keyboard navigation
 * - Focus management
 */
export async function Header({ variant = 'default' }: HeaderProps) {
  const t = await getTranslations('Navigation');
  const session = await getSession();

  return (
    <>
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        {t('skipToContent')}
      </a>

      <header
        className={cn(
          'bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm',
          variant === 'catalog' && 'border-b-2'
        )}
        role="banner"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            <MobileMenu />

            {/* Logo */}
            <Link
              href="/"
              className="focus-visible:ring-ring flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="PS Foodbook - Home"
            >
              <div className="bg-primary flex size-8 items-center justify-center rounded-md">
                <span className="text-primary-foreground text-lg font-bold">
                  PS
                </span>
              </div>
              <span className="hidden text-lg font-semibold sm:inline-block">
                Foodbook
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <HeaderNavigation />

          {/* Right: User menu + Language switcher */}
          <div className="flex items-center gap-2">
            <UserMenu session={session} />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
}