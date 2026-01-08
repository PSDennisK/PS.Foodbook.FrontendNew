import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { productKeys } from '@/lib/api/query-keys';

/**
 * Product search parameters
 */
export interface ProductSearchParams extends Record<string, unknown> {
  keyword?: string;
  page?: number;
  pageSize?: number;
  brands?: number[];
  categories?: number[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'relevance' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';
}

/**
 * Product type (placeholder)
 */
export interface Product {
  id: number;
  name: string;
  brand: string;
  brandId: number;
  articleNumber: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
}

/**
 * Product search response (placeholder)
 */
export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch products from the API
 * This is a placeholder implementation that will be replaced with actual API calls
 */
async function fetchProducts(
  params: ProductSearchParams
): Promise<ProductSearchResponse> {
  // TODO: Replace with actual API call to NEXT_PUBLIC_FOODBOOK_API_URL/v2/Search/SearchResults
  // For now, return mock data
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  return {
    products: [
      {
        id: 1,
        name: 'Tomaten Cherry',
        brand: 'Fresh & Easy',
        brandId: 101,
        articleNumber: 'TOM-001',
        description: 'Verse cherry tomaten uit eigen kweek',
        price: 2.99,
        image: '/placeholder-product.jpg',
        inStock: true,
      },
      {
        id: 2,
        name: 'Komkommer',
        brand: 'Green Valley',
        brandId: 102,
        articleNumber: 'KOM-001',
        description: 'Verse komkommer',
        price: 1.49,
        image: '/placeholder-product.jpg',
        inStock: true,
      },
    ],
    total: 2,
    page: params.page ?? 0,
    pageSize: params.pageSize ?? 21,
    totalPages: 1,
  };
}

/**
 * Hook to fetch products with search parameters
 *
 * @example
 * ```tsx
 * function ProductList() {
 *   const { data, isLoading, error } = useProducts({ keyword: 'tomaat' });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {data.products.map((product) => (
 *         <ProductCard key={product.id} product={product} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProducts(
  params: ProductSearchParams = {},
  options?: Omit<UseQueryOptions<ProductSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    // Provide placeholder data for optimistic UI
    placeholderData: (previousData) => previousData,
    // Only fetch if we have search params
    enabled: options?.enabled ?? true,
    ...options,
  });
}

/**
 * Hook to fetch a single product by ID
 *
 * @example
 * ```tsx
 * function ProductDetail({ id }: { id: number }) {
 *   const { data, isLoading, error } = useProduct(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return <div>Product not found</div>;
 *
 *   return <ProductCard product={data} />;
 * }
 * ```
 */
export function useProduct(
  id: number,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      // TODO: Replace with actual API call to NEXT_PUBLIC_FOODBOOK_API_URL/v2/Product/GetProductSheet/{id}
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        id,
        name: 'Tomaten Cherry',
        brand: 'Fresh & Easy',
        brandId: 101,
        articleNumber: 'TOM-001',
        description: 'Verse cherry tomaten uit eigen kweek',
        price: 2.99,
        image: '/placeholder-product.jpg',
        inStock: true,
      };
    },
    ...options,
  });
}

/**
 * Hook to fetch autocomplete suggestions
 *
 * @example
 * ```tsx
 * function SearchAutocomplete({ keyword }: { keyword: string }) {
 *   const { data, isLoading } = useProductAutocomplete(keyword, {
 *     enabled: keyword.length >= 2
 *   });
 *
 *   if (!data) return null;
 *
 *   return (
 *     <ul>
 *       {data.map((suggestion) => (
 *         <li key={suggestion}>{suggestion}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useProductAutocomplete(
  keyword: string,
  options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.autocomplete(keyword),
    queryFn: async () => {
      // TODO: Replace with actual API call to NEXT_PUBLIC_FOODBOOK_API_URL/v2/Search/{locale}/AutoComplete/{keyword}
      await new Promise((resolve) => setTimeout(resolve, 200));

      return ['Tomaten Cherry', 'Tomaten Roma', 'Tomatensaus'];
    },
    // Only fetch if keyword is at least 2 characters
    enabled: keyword.length >= 2 && (options?.enabled ?? true),
    // Autocomplete should have shorter stale time
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}
