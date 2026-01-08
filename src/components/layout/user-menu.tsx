'use client';

import { LogIn, LogOut, User, Settings, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/routing';

interface UserMenuProps {
  /**
   * Session data if user is logged in
   */
  session?: {
    user: {
      name?: string;
      email: string;
    };
  } | null;
}

/**
 * User Menu Component
 *
 * Shows login button for unauthenticated users, or
 * a dropdown menu with user options for authenticated users.
 *
 * Accessibility:
 * - Keyboard navigable dropdown
 * - ARIA labels for screen readers
 * - Focus management via Radix UI
 * - Clear visual states
 */
export function UserMenu({ session }: UserMenuProps) {
  const t = useTranslations('Navigation');

  // Not logged in - show login button
  if (!session) {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="gap-2"
        aria-label={t('login')}
      >
        <Link href="/login">
          <LogIn className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">{t('login')}</span>
        </Link>
      </Button>
    );
  }

  // Logged in - show user menu dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label={t('myAccount')}
        >
          <User className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">
            {session.user.name ?? session.user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            {session.user.name ? <p className="text-sm font-medium">{session.user.name}</p> : null}
            <p className="text-muted-foreground text-xs">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="gap-2">
            <User className="size-4" aria-hidden="true" />
            <span>{t('myAccount')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="gap-2">
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span>{t('myOrders')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="gap-2">
            <Settings className="size-4" aria-hidden="true" />
            <span>{t('settings')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/logout" className="gap-2">
            <LogOut className="size-4" aria-hidden="true" />
            <span>{t('logout')}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
