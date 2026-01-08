# CLAUDE.md - Foodbook v2 Development Guide

> Dit document geeft Claude Code context over het project voor effectieve assistentie.

## Project Overzicht

**Foodbook v2** is een parallelle herbouw van de PS Foodservice productcatalogus frontend. Het is een Next.js 15 applicatie die communiceert met een bestaande C# .NET backend API.

### Doelen
- Moderne tech stack (Next.js 15, Tailwind 4, shadcn/ui)
- WCAG 2.1 AA+ accessibility compliance
- Betere performance (TanStack Query, Server Components)
- Veiligere architectuur (HTTP-only cookies, CSP headers)
- Eenvoudiger te onderhouden codebase

### Niet in scope
- Backend wijzigingen (C# API blijft ongewijzigd)
- Nieuwe features (alleen bestaande functionaliteit)
- Database migraties

---

## Tech Stack

```
Framework:      Next.js 15.1.x (App Router)
React:          19.x
TypeScript:     5.7.x
Styling:        Tailwind CSS 4.x
UI Library:     shadcn/ui (Radix primitives)
State:          TanStack Query 5.x (server state)
                Zustand 5.x (UI state, minimal)
                nuqs 2.x (URL state)
Forms:          React Hook Form 7.x + Zod 3.x
i18n:           next-intl 3.x
Auth:           jose 5.x (JWT)
Testing:        Vitest + Playwright
```

---

## Projectstructuur

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/            # i18n routing
│   │   ├── (foodbook)/      # Product catalogus routes
│   │   └── (website)/       # WordPress content routes
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # shadcn/ui componenten
│   ├── layout/              # Header, footer, nav
│   ├── product/             # Product-specifieke componenten
│   ├── search/              # Zoeken en filters
│   └── ...
├── lib/
│   ├── api/                 # API clients en hooks
│   ├── auth/                # Authenticatie utilities
│   ├── hooks/               # React hooks
│   ├── utils/               # Helper functions
│   └── validations/         # Zod schemas
├── stores/                  # Zustand stores (minimal)
├── i18n/                    # next-intl configuratie
└── types/                   # TypeScript types
```

---

## Coding Conventies

### TypeScript

```typescript
// ✅ Gebruik 'satisfies' voor type checking met inference
const config = {
  locales: ['nl', 'en', 'de', 'fr'],
} satisfies Config;

// ✅ Gebruik type imports
import type { Product } from '@/types/foodbook';

// ✅ Strikte null checks
function getProduct(id: number): Product | null {
  // ...
}

// ❌ Vermijd 'any'
function processData(data: any) { } // Niet doen
```

### React Components

```typescript
// ✅ Server Components zijn default (geen 'use client' tenzij nodig)
// app/[locale]/product/page.tsx
export default async function ProductPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}

// ✅ Client Components alleen voor interactivity
// components/search/search-bar.tsx
'use client';

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  // ...
}

// ✅ Props interface boven component
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  // ...
}
```

### Styling met Tailwind

```typescript
// ✅ Gebruik cn() voor conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary text-primary-foreground',
  className
)} />

// ✅ Gebruik CSS variables voor theming
<div className="bg-background text-foreground" />

// ❌ Vermijd inline styles
<div style={{ padding: '16px' }} /> // Niet doen
```

### Data Fetching

```typescript
// ✅ Server Components: direct fetchen
// app/[locale]/product/[id]/page.tsx
export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// ✅ Client Components: TanStack Query hooks
// components/product/product-grid.tsx
'use client';

import { useProducts } from '@/lib/hooks/use-products';

export function ProductGrid() {
  const { data, isLoading, error } = useProducts(filters);
  // ...
}

// ✅ Prefetch op server, hydrate op client
// app/[locale]/product/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: productKeys.list(params),
    queryFn: () => searchProducts(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductGrid />
    </HydrationBoundary>
  );
}
```

### URL State met nuqs

```typescript
// ✅ Type-safe URL parameters
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';

const filterParsers = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(0),
  brands: parseAsArrayOf(parseAsInteger).withDefault([]),
};

export function useProductFilters() {
  return useQueryStates(filterParsers);
}
```

---

## API Integratie

### Base URLs (Environment)

```bash
NEXT_PUBLIC_FOODBOOK_API_URL=https://api.foodbook.psinfoodservice.com
NEXT_PUBLIC_WP_API_URL=https://psinfoodservice.online/wp-json
NEXT_PUBLIC_WEBAPI_API_URL=https://webapi.psinfoodservice.com
```

### Foodbook API Endpoints

| Endpoint | Method | Gebruik |
|----------|--------|---------|
| `/v2/Product/GetProductSheet/{id}` | GET | Product detail |
| `/v2/Search/SearchResults` | POST | Zoeken met filters |
| `/v2/Search/{locale}/AutoComplete/{keyword}` | GET | Autocomplete |
| `/v2/Brand/BrandInfo/{id}` | GET | Merk informatie |
| `/v2/Filter/List` | GET | Beschikbare filters |

### WordPress API Endpoints

| Endpoint | Method | Gebruik |
|----------|--------|---------|
| `/wp/v2/pages?slug={slug}` | GET | Pagina content |
| `/wp/v2/posts` | GET | Blog posts |
| `/menus/v1/menus/{slug}` | GET | Menu items |
| `/cf7/v1/forms/{id}/submit` | POST | Contact form |

### Query Keys Convention

```typescript
// lib/api/query-keys.ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: SearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};
```

---

## Belangrijke Patronen

### Authenticatie

```typescript
// Server-side: cookies
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth/session';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/login');
  // ...
}

// Client-side: TanStack Query
import { useSession } from '@/lib/hooks/use-session';

export function UserMenu() {
  const { data: session, isLoading } = useSession();
  // ...
}
```

### Internationalization

```typescript
// Server Component
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Product');
  return <h1>{t('title')}</h1>;
}

// Client Component
'use client';
import { useTranslations } from 'next-intl';

export function SearchBar() {
  const t = useTranslations('Search');
  return <input placeholder={t('placeholder')} />;
}

// Link met locale
import { Link } from '@/i18n/routing';
<Link href="/product/123">Product</Link>
```

### Error Handling

```typescript
// API errors
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
  }
}

// Component error boundary
'use client';
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary fallback={<ErrorMessage />}>
  <ProductGrid />
</ErrorBoundary>

// Page-level error
// app/[locale]/product/[id]/error.tsx
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Er ging iets mis</p>
      <button onClick={reset}>Opnieuw proberen</button>
    </div>
  );
}
```

---

## WCAG 2.1 AA Checklist

Bij elke component:

- [ ] **Keyboard navigatie** - Alle interactieve elementen bereikbaar met Tab
- [ ] **Focus visible** - Duidelijke focus indicator (ring-2 ring-ring)
- [ ] **ARIA labels** - Screen reader context waar nodig
- [ ] **Color contrast** - Minimum 4.5:1 ratio
- [ ] **Heading hierarchy** - h1 → h2 → h3 in volgorde
- [ ] **Alt text** - Beschrijvende alt voor afbeeldingen
- [ ] **Form labels** - Elk input heeft een label
- [ ] **Error messages** - Beschrijvend en gekoppeld aan input
- [ ] **Reduced motion** - Respecteer prefers-reduced-motion
- [ ] **Touch targets** - Minimum 44x44px voor touch

### Voorbeeld accessible component:

```typescript
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group focus-within:ring-2 focus-within:ring-ring rounded-lg">
      <Link
        href={`/product/${product.id}`}
        className="block focus:outline-none"
        aria-label={`${product.name} van ${product.brand}, bekijk details`}
      >
        <Image
          src={product.image}
          alt="" // Decoratief, info is in link label
          // ...
        />
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-muted-foreground">{product.brand}</p>
      </Link>
    </article>
  );
}
```

---

## Veelvoorkomende Taken

### Nieuwe pagina toevoegen

```bash
# 1. Maak de page file
touch src/app/[locale]/(foodbook)/nieuwe-pagina/page.tsx

# 2. Voeg translations toe
# messages/nl.json, en.json, de.json, fr.json

# 3. Voeg route toe aan routing.ts indien custom pad nodig
```

### Nieuw shadcn component toevoegen

```bash
npx shadcn@latest add [component-naam]

# Bijvoorbeeld:
npx shadcn@latest add dialog
npx shadcn@latest add toast
```

### Nieuwe API hook toevoegen

```typescript
// lib/hooks/use-nieuwe-data.ts
import { useQuery } from '@tanstack/react-query';

export const nieuweDataKeys = {
  all: ['nieuweData'] as const,
  detail: (id: number) => [...nieuweDataKeys.all, id] as const,
};

export function useNieuweData(id: number) {
  return useQuery({
    queryKey: nieuweDataKeys.detail(id),
    queryFn: () => fetchNieuweData(id),
  });
}
```

---

## Testing

### Unit Tests (Vitest)

```typescript
// __tests__/hooks/use-products.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '@/lib/hooks/use-products';

describe('useProducts', () => {
  it('fetches products successfully', async () => {
    const { result } = renderHook(() => useProducts({ keyword: 'test' }));
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data?.products).toHaveLength(21);
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/product-search.spec.ts
import { test, expect } from '@playwright/test';

test('user can search for products', async ({ page }) => {
  await page.goto('/nl/product');
  
  await page.getByRole('searchbox').fill('tomaat');
  await page.getByRole('button', { name: 'Zoeken' }).click();
  
  await expect(page.getByRole('article')).toHaveCount(21);
});
```

---

## Deployment

### Build

```bash
npm run build
# Output: .next/standalone/
```

### Environment Variables (Production)

```bash
NODE_ENV=production
NEXT_PUBLIC_FOODBOOK_API_URL=https://api.foodbook.psinfoodservice.com
NEXT_PUBLIC_WP_API_URL=https://psinfoodservice.online/wp-json
# ... etc
```

### Run Production

```bash
# Windows Server (IIS reverse proxy naar Node)
set NODE_ENV=production
set PORT=3000
node .next/standalone/server.js
```

---

## Troubleshooting

### Hydration Mismatch

```typescript
// Probleem: Server en client renderen anders
// Oplossing: Gebruik useEffect voor client-only data

'use client';
import { useState, useEffect } from 'react';

export function ClientDate() {
  const [date, setDate] = useState<string>();
  
  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);
  
  if (!date) return null;
  return <time>{date}</time>;
}
```

### TanStack Query Cache Issues

```typescript
// Forceer refetch na mutatie
const queryClient = useQueryClient();

await mutation.mutateAsync(data);
queryClient.invalidateQueries({ queryKey: productKeys.all });
```

### i18n Missing Translation

```typescript
// Check in messages/nl.json
// Gebruik namespace correct
const t = useTranslations('Product'); // Niet 'product' (lowercase)
```

---

## Hulpbronnen

- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [next-intl](https://next-intl-docs.vercel.app)
- [nuqs](https://nuqs.47ng.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## Contact

**Project:** Foodbook v2
**Organisatie:** PS in Foodservice
**Developer:** Dennis (Weblogiq)
