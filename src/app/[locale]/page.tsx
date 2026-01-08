import { getTranslations } from 'next-intl/server';

/**
 * Home page
 */
export default async function HomePage() {
  const t = await getTranslations('Navigation');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">PS Foodbook v2</h1>
        <p className="text-muted-foreground mt-4">{t('home')}</p>
      </div>
    </div>
  );
}
