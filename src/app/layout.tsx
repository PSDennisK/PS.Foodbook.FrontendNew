import type { ReactNode } from 'react';

import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout
 *
 * This is the top-level layout that wraps the entire application.
 * With next-intl and localePrefix: 'always', the <html> and <body> tags
 * are handled by app/[locale]/layout.tsx, so this layout only passes through children.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}