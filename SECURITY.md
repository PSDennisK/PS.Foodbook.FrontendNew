# Security Implementation Guide

This document describes the security features implemented in this application.

## Security Headers

All responses include the following security headers (configured in `middleware.ts`):

### HTTP Security Headers

- **X-DNS-Prefetch-Control**: `on` - Allows DNS prefetching for faster page loads
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` - Forces HTTPS for 1 year
- **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking by allowing frames only from same origin
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Only sends origin for cross-origin requests

### Permissions Policy

Disables sensitive browser features:

- Camera: disabled
- Microphone: disabled
- Geolocation: disabled
- Interest Cohort (FLoC): disabled

### Content Security Policy (CSP)

Strict CSP rules to prevent XSS and other injection attacks:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://api.foodbook.psinfoodservice.com https://webapi.psinfoodservice.com https://psinfoodservice.online;
frame-src 'self' https://www.google.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'self';
upgrade-insecure-requests;
```

## Authentication & Session Management

### JWT-based Authentication

The application uses HTTP-only cookies with JWT tokens for authentication.

#### Configuration

Set the following environment variables:

```bash
JWT_SECRET=your-super-secret-key-here
```

**Important**: Use a strong, random secret in production.

#### Session Functions

Located in `src/lib/auth/session.ts`:

##### `getSession()`

Get the current user session:

```typescript
import { getSession } from '@/lib/auth/session';

export default async function ProtectedPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

##### `isAuthenticated()`

Check if user is logged in:

```typescript
import { isAuthenticated } from '@/lib/auth/session';

export default async function Page() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return <LoginForm />;
  }

  return <Dashboard />;
}
```

##### `hasPermission()`

Check if user has a specific permission:

```typescript
import { hasPermission } from '@/lib/auth/session';

export default async function AdminPage() {
  const canManageUsers = await hasPermission('users:manage');

  if (!canManageUsers) {
    return <Forbidden />;
  }

  return <UserManagement />;
}
```

##### `hasRole()`

Check if user has a specific role:

```typescript
import { hasRole } from '@/lib/auth/session';

export default async function AdminDashboard() {
  const isAdmin = await hasRole('admin');

  if (!isAdmin) {
    return <Forbidden />;
  }

  return <AdminPanel />;
}
```

##### `getSessionToken()`

Get the raw JWT token for API calls:

```typescript
import { getSessionToken } from '@/lib/auth/session';

export async function fetchProtectedData() {
  const token = await getSessionToken();

  const response = await fetch('/api/protected', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
```

## Middleware Configuration

The middleware (`middleware.ts`) runs on all routes except:

- API routes (`/api/*`)
- Static files (`/_next/static/*`, `/_next/image/*`)
- Public assets (`/images/*`, `/videos/*`, `/fonts/*`)
- Metadata files (`favicon.ico`, `robots.txt`, `sitemap.xml`)

### Middleware Execution Order

1. **i18n routing** - Handles locale detection and routing
2. **Security headers** - Adds security headers to the response

## Environment Variables

### Required

```bash
# API URLs (public)
NEXT_PUBLIC_FOODBOOK_API_URL=https://api.foodbook.psinfoodservice.com
NEXT_PUBLIC_WP_API_URL=https://psinfoodservice.online/wp-json
NEXT_PUBLIC_WEBAPI_API_URL=https://webapi.psinfoodservice.com

# Authentication (server-only)
JWT_SECRET=your-secret-key
```

### Optional

```bash
# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# Feature flags
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
```

## Best Practices

### 1. Always Use HTTPS in Production

Ensure your application is served over HTTPS. The HSTS header will enforce this for returning visitors.

### 2. Rotate JWT Secrets Regularly

Change your `JWT_SECRET` periodically and whenever there's a potential compromise.

### 3. Use HTTP-Only Cookies

Never store JWT tokens in localStorage or sessionStorage. Always use HTTP-only cookies to prevent XSS attacks.

### 4. Validate Permissions Server-Side

Always validate permissions on the server. Never trust client-side checks alone.

### 5. Keep Dependencies Updated

Regularly update dependencies to patch security vulnerabilities:

```bash
npm audit
npm audit fix
```

### 6. Monitor Security Headers

Use tools like [securityheaders.com](https://securityheaders.com) to verify your security headers are correctly configured.

### 7. Content Security Policy Violations

Monitor CSP violations in production. Add reporting endpoint if needed:

```typescript
report-uri /api/csp-report;
```

## Security Checklist

- [ ] Strong `JWT_SECRET` set in production
- [ ] HTTPS enabled
- [ ] Security headers verified
- [ ] CSP configured correctly
- [ ] HTTP-only cookies for sessions
- [ ] Server-side permission checks
- [ ] Dependencies updated
- [ ] Environment variables secured
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation on all forms
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (CSP + input sanitization)

## Reporting Security Issues

If you discover a security vulnerability, please email: security@psinfoodservice.com

Do not create public GitHub issues for security vulnerabilities.
