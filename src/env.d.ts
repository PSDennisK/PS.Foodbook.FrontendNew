/**
 * Environment variable type definitions
 *
 * This file provides type-safe access to environment variables.
 * Add new environment variables here to get TypeScript autocompletion and validation.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Node environment
    NODE_ENV: 'development' | 'production' | 'test';

    // API URLs
    NEXT_PUBLIC_FOODBOOK_API_URL: string;
    NEXT_PUBLIC_WP_API_URL: string;
    NEXT_PUBLIC_WEBAPI_API_URL: string;

    // Authentication
    JWT_SECRET: string;

    // Optional: Analytics
    NEXT_PUBLIC_GTM_ID?: string;
    NEXT_PUBLIC_GA_ID?: string;

    // Optional: reCAPTCHA
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string;
    RECAPTCHA_SECRET_KEY?: string;

    // Optional: Feature flags
    NEXT_PUBLIC_ENABLE_DEVTOOLS?: string;
  }
}
