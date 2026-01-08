/**
 * WordPress API Client
 *
 * Handles fetching data from the WordPress REST API.
 * Uses the WP REST API v2 for pages, posts, and custom menu endpoints.
 */

import type { Locale } from '@/i18n/config';

/**
 * WordPress menu item from the WP REST API Menus plugin
 */
export interface WordPressMenuItem {
  ID: number;
  title: string;
  url: string;
  attr_title: string;
  description: string;
  classes: string[];
  target: string;
  xfn: string;
  menu_order: number;
  object_id: number;
  object: string;
  type: string;
  type_label: string;
  children?: WordPressMenuItem[];
}

/**
 * WordPress menu response
 */
export interface WordPressMenu {
  ID: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  items: WordPressMenuItem[];
}

/**
 * WordPress page response
 */
export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
  excerpt?: {
    rendered: string;
  };
  featured_media?: number;
  _links: {
    'wp:featuredmedia'?: Array<{
      href: string;
    }>;
  };
}

/**
 * WordPress post response
 */
export interface WordPressPost extends WordPressPage {
  categories: number[];
  tags: number[];
  author: number;
}

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

if (!WP_API_URL) {
  throw new Error('NEXT_PUBLIC_WP_API_URL environment variable is not set');
}

/**
 * Fetch a WordPress menu by slug
 *
 * Requires the WP REST API Menus plugin
 * @see https://wordpress.org/plugins/wp-rest-api-menus/
 */
export async function getWordPressMenu(
  slug: string
): Promise<WordPressMenu | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/menus/v1/menus/${encodeURIComponent(slug)}`,
      {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `WordPress API error: ${response.status.toString()} ${response.statusText}`
      );
    }

    return (await response.json()) as WordPressMenu;
  } catch (error) {
    console.error(`Failed to fetch WordPress menu "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch a WordPress page by slug
 */
export async function getWordPressPage(
  slug: string,
  locale?: Locale
): Promise<WordPressPage | null> {
  try {
    const params = new URLSearchParams({
      slug,
      ...(locale !== undefined && { lang: locale }),
    });

    const response = await fetch(
      `${WP_API_URL}/wp/v2/pages?${params.toString()}`,
      {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status.toString()} ${response.statusText}`
      );
    }

    const pages = (await response.json()) as WordPressPage[];

    if (pages.length === 0) {
      return null;
    }

    return pages[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch WordPress page "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch WordPress posts with optional filters
 */
export async function getWordPressPosts(params?: {
  page?: number;
  per_page?: number;
  categories?: number[];
  tags?: number[];
  locale?: Locale;
}): Promise<WordPressPost[]> {
  try {
    const searchParams = new URLSearchParams({
      page: params?.page?.toString() ?? '1',
      per_page: params?.per_page?.toString() ?? '10',
      ...(params?.categories !== undefined && {
        categories: params.categories.join(','),
      }),
      ...(params?.tags !== undefined && { tags: params.tags.join(',') }),
      ...(params?.locale !== undefined && { lang: params.locale }),
    });

    const response = await fetch(
      `${WP_API_URL}/wp/v2/posts?${searchParams.toString()}`,
      {
      next: {
        revalidate: 600, // Cache for 10 minutes
      },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status.toString()} ${response.statusText}`
      );
    }

    return (await response.json()) as WordPressPost[];
  } catch (error) {
    console.error('Failed to fetch WordPress posts:', error);
    return [];
  }
}

/**
 * Helper to check if a URL is internal (relative or same domain)
 */
export function isInternalUrl(url: string): boolean {
  if (url.startsWith('/')) {
    return true;
  }

  try {
    const urlObj = new URL(url);
    const wpUrl = new URL(WP_API_URL);
    return urlObj.hostname === wpUrl.hostname;
  } catch {
    return false;
  }
}

/**
 * Helper to convert WordPress absolute URLs to relative paths
 */
export function toRelativePath(url: string): string {
  if (url.startsWith('/')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}
