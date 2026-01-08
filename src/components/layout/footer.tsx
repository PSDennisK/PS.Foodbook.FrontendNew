import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { getWordPressMenu, isInternalUrl, toRelativePath } from '@/lib/api/wordpress';
import { cn } from '@/lib/utils';

/**
 * Footer menu group
 */
interface FooterMenuGroup {
  title: string;
  slug: string;
}

/**
 * Footer Component
 *
 * Main application footer with logo, description, WordPress menu links,
 * and legal information. Responsive grid layout with semantic HTML.
 *
 * Features:
 * - WordPress menu integration
 * - Responsive grid (1 col mobile, 2 tablet, 4 desktop)
 * - Logo and company description
 * - Copyright and legal links
 * - WCAG 2.1 AA compliant
 *
 * Accessibility:
 * - nav element with aria-label
 * - Proper heading hierarchy (h2 for sections)
 * - Keyboard navigation
 * - Focus visible states
 * - Sufficient color contrast
 */
export async function Footer() {
  const t = await getTranslations('Footer');
  const currentYear = new Date().getFullYear();

  // Define footer menu groups to fetch from WordPress
  const menuGroups: FooterMenuGroup[] = [
    { title: t('company'), slug: 'footer-company' },
    { title: t('support'), slug: 'footer-support' },
    { title: t('legal'), slug: 'footer-legal' },
  ];

  // Fetch WordPress menus in parallel
  const menus = await Promise.all(
    menuGroups.map(async (group) => ({
      ...group,
      items: (await getWordPressMenu(group.slug))?.items ?? [],
    }))
  );

  return (
    <footer
      className="bg-muted/30 border-t mt-auto"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Main footer grid */}
        <nav
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          aria-label="Footer navigatie"
        >
          {/* Column 1: Logo + Description */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="focus-visible:ring-ring flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="PS Foodbook - Home"
            >
              <div className="bg-primary flex size-10 items-center justify-center rounded-md">
                <span className="text-primary-foreground text-xl font-bold">
                  PS
                </span>
              </div>
              <span className="text-lg font-semibold">Foodbook</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              PS in Foodservice is dé leverancier van hoogwaardige
              foodservice-producten voor de horeca en groothandel.
            </p>
          </div>

          {/* Columns 2-4: WordPress menu link groups */}
          {menus.map((menu) => (
            <div key={menu.slug}>
              <h2 className="mb-4 font-semibold">{menu.title}</h2>
              {menu.items.length > 0 ? (
                <ul className="flex flex-col gap-2" role="list">
                  {menu.items.map((item) => {
                    const isInternal = isInternalUrl(item.url);
                    const href = isInternal ? toRelativePath(item.url) : item.url;

                    // For internal links, use regular anchor to avoid type issues with dynamic WordPress URLs
                    return (
                      <li key={item.ID}>
                        <a
                          href={isInternal ? href : item.url}
                          target={item.target || '_self'}
                          rel={
                            item.target === '_blank' || !isInternal
                              ? 'noopener noreferrer'
                              : undefined
                          }
                          className={cn(
                            'text-muted-foreground hover:text-foreground text-sm transition-colors',
                            'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                          )}
                        >
                          {item.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Geen links beschikbaar
                </p>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom bar: Copyright + Legal links */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-muted-foreground text-sm">
              {t('copyright', { year: currentYear })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/privacy"
                className={cn(
                  'text-muted-foreground hover:text-foreground text-sm transition-colors',
                  'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                )}
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className={cn(
                  'text-muted-foreground hover:text-foreground text-sm transition-colors',
                  'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                )}
              >
                {t('terms')}
              </Link>
              <Link
                href="/cookies"
                className={cn(
                  'text-muted-foreground hover:text-foreground text-sm transition-colors',
                  'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                )}
              >
                {t('cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
