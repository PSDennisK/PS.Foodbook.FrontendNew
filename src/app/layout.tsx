import type { ReactNode } from 'react';

import { defaultLocale } from '@/i18n/config';

import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout
 *
 * This is the top-level layout that wraps the entire application.
 * It only contains the <html> and <body> tags.
 * The actual locale-specific layout is in app/[locale]/layout.tsx
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}