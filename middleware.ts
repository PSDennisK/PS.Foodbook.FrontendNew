import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

import { routing } from './src/i18n/routing';

/**
 * next-intl middleware for i18n routing
 */
const intlMiddleware = createMiddleware(routing);

/**
 * Security headers configuration
 * Implements best practices for web security
 */
function getSecurityHeaders() {
  const headers = new Headers();

  // DNS Prefetch Control
  headers.set('X-DNS-Prefetch-Control', 'on');

  // HSTS - Force HTTPS for 1 year including subdomains
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Prevent clickjacking attacks
  headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer Policy - Only send origin for cross-origin requests
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - Disable sensitive features
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy
  const cspDirectives = [
    // Default: only allow resources from same origin
    "default-src 'self'",

    // Scripts: self, Google Tag Manager, reCAPTCHA
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com",

    // Styles: self + inline styles (needed for CSS-in-JS)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Fonts: self + Google Fonts
    "font-src 'self' https://fonts.gstatic.com",

    // Images: self, data URIs, HTTPS, blob
    "img-src 'self' data: https: blob:",

    // API connections: self + backend APIs
    "connect-src 'self' https://api.foodbook.psinfoodservice.com https://webapi.psinfoodservice.com https://psinfoodservice.online",

    // Frames: reCAPTCHA
    "frame-src 'self' https://www.google.com",

    // Object/embed: none
    "object-src 'none'",

    // Base URI: self only
    "base-uri 'self'",

    // Form actions: self only
    "form-action 'self'",

    // Frame ancestors: same origin only
    "frame-ancestors 'self'",

    // Upgrade insecure requests
    'upgrade-insecure-requests',
  ];

  headers.set('Content-Security-Policy', cspDirectives.join('; '));

  return headers;
}

/**
 * Main middleware function
 *
 * 1. Runs next-intl middleware for i18n routing
 * 2. Adds security headers to all responses
 */
export default function middleware(request: NextRequest) {
  // Run i18n middleware first
  const response = intlMiddleware(request);

  // Add security headers to the response
  const securityHeaders = getSecurityHeaders();
  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Middleware configuration
 *
 * Match all routes EXCEPT:
 * - API routes (/api/*)
 * - Static files (/_next/*, /images/*, etc.)
 * - Favicon, robots.txt, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, videos, fonts (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|videos|fonts).*)',
  ],
};
