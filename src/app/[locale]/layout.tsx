import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Header } from '@/components/layout/header';
import { QueryProvider } from '@/components/providers/query-provider';
import { locales, type Locale } from '@/i18n/config';

import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PS Foodbook',
  description: 'Product catalogus voor PS in Foodservice',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Locale-specific layout
 *
 * This layout wraps all pages with the current locale.
 * It provides:
 * - next-intl messages
 * - TanStack Query client
 * - Font variables
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/**
 * Generate static params for all locales
 * This enables static generation for all locale routes
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}