/**
 * Query key factories for TanStack Query
 *
 * Following best practices from TanStack Query docs:
 * - Use arrays for query keys
 * - Hierarchical structure (all > lists > list, all > details > detail)
 * - Type-safe with 'as const'
 */

/**
 * Product query keys
 *
 * @example
 * productKeys.all // ['products']
 * productKeys.lists() // ['products', 'list']
 * productKeys.list({ keyword: 'tomato' }) // ['products', 'list', { keyword: 'tomato' }]
 * productKeys.details() // ['products', 'detail']
 * productKeys.detail(123) // ['products', 'detail', 123]
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(params: T) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productKeys.details(), id] as const,
  autocomplete: (keyword: string) =>
    [...productKeys.all, 'autocomplete', keyword] as const,
} as const;

/**
 * Brand query keys
 *
 * @example
 * brandKeys.all // ['brands']
 * brandKeys.lists() // ['brands', 'list']
 * brandKeys.list({ page: 1 }) // ['brands', 'list', { page: 1 }]
 * brandKeys.details() // ['brands', 'detail']
 * brandKeys.detail(456) // ['brands', 'detail', 456]
 */
export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(params: T) =>
    [...brandKeys.lists(), params] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...brandKeys.details(), id] as const,
  products: (id: number | string) =>
    [...brandKeys.detail(id), 'products'] as const,
} as const;

/**
 * Blog query keys
 *
 * @example
 * blogKeys.all // ['blog']
 * blogKeys.lists() // ['blog', 'list']
 * blogKeys.list({ category: 'recipes' }) // ['blog', 'list', { category: 'recipes' }]
 * blogKeys.details() // ['blog', 'detail']
 * blogKeys.detail('my-post-slug') // ['blog', 'detail', 'my-post-slug']
 */
export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(params: T) =>
    [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
} as const;

/**
 * WordPress query keys (for general WordPress content)
 *
 * @example
 * wordpressKeys.all // ['wordpress']
 * wordpressKeys.pages() // ['wordpress', 'pages']
 * wordpressKeys.page('about') // ['wordpress', 'pages', 'about']
 * wordpressKeys.menus() // ['wordpress', 'menus']
 * wordpressKeys.menu('main') // ['wordpress', 'menus', 'main']
 */
export const wordpressKeys = {
  all: ['wordpress'] as const,
  pages: () => [...wordpressKeys.all, 'pages'] as const,
  page: (slug: string) => [...wordpressKeys.pages(), slug] as const,
  menus: () => [...wordpressKeys.all, 'menus'] as const,
  menu: (slug: string) => [...wordpressKeys.menus(), slug] as const,
} as const;

/**
 * Filter query keys
 *
 * @example
 * filterKeys.all // ['filters']
 * filterKeys.list() // ['filters', 'list']
 */
export const filterKeys = {
  all: ['filters'] as const,
  list: () => [...filterKeys.all, 'list'] as const,
} as const;

/**
 * User/Auth query keys
 *
 * @example
 * authKeys.session() // ['auth', 'session']
 * authKeys.user() // ['auth', 'user']
 */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
} as const;
