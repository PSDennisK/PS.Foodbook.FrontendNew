import { cookies } from 'next/headers';
import { jwtVerify, type JWTPayload } from 'jose';

/**
 * JWT Session payload structure
 * Extend this interface based on your actual JWT payload
 */
export interface SessionPayload extends JWTPayload {
  userId: number;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
}

/**
 * Session data returned to the application
 */
export interface Session {
  user: {
    id: number;
    email: string;
    name?: string;
    role?: string;
    permissions?: string[];
  };
  expiresAt: Date;
}

/**
 * Cookie configuration
 */
const SESSION_COOKIE_NAME = 'session';
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key'; // TODO: Set in .env

/**
 * Get the JWT secret as a Uint8Array
 */
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 *
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    return payload as SessionPayload;
  } catch (error) {
    // Token is invalid, expired, or malformed
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Get the current session from HTTP-only cookie
 *
 * This function reads the session cookie, verifies the JWT,
 * and returns the session data if valid.
 *
 * @returns Session object or null if not authenticated
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const session = await getSession();
 *
 *   if (!session) {
 *     redirect('/login');
 *   }
 *
 *   return <div>Welcome, {session.user.name}!</div>;
 * }
 * ```
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  // Verify token hasn't expired
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return {
    user: {
      id: payload.userId,
      email: payload.email,
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.role !== undefined && { role: payload.role }),
      ...(payload.permissions !== undefined && {
        permissions: payload.permissions,
      }),
    },
    expiresAt: new Date(payload.exp ? payload.exp * 1000 : Date.now()),
  };
}

/**
 * Check if the user is authenticated
 *
 * @returns true if user has a valid session
 *
 * @example
 * ```tsx
 * export default async function Page() {
 *   const authenticated = await isAuthenticated();
 *
 *   if (!authenticated) {
 *     return <LoginForm />;
 *   }
 *
 *   return <Dashboard />;
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Get the session token from cookies (without verification)
 *
 * Use this when you need to pass the token to an API call
 *
 * @returns JWT token string or null
 *
 * @example
 * ```tsx
 * const token = await getSessionToken();
 * const response = await fetch('/api/protected', {
 *   headers: {
 *     Authorization: `Bearer ${token}`,
 *   },
 * });
 * ```
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

/**
 * Check if user has a specific permission
 *
 * @param permission - Permission string to check
 * @returns true if user has the permission
 *
 * @example
 * ```tsx
 * export default async function AdminPage() {
 *   const canManageUsers = await hasPermission('users:manage');
 *
 *   if (!canManageUsers) {
 *     return <Forbidden />;
 *   }
 *
 *   return <UserManagement />;
 * }
 * ```
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getSession();

  if (!session) {
    return false;
  }

  return session.user.permissions?.includes(permission) ?? false;
}

/**
 * Check if user has a specific role
 *
 * @param role - Role string to check
 * @returns true if user has the role
 *
 * @example
 * ```tsx
 * export default async function AdminDashboard() {
 *   const isAdmin = await hasRole('admin');
 *
 *   if (!isAdmin) {
 *     return <Forbidden />;
 *   }
 *
 *   return <AdminPanel />;
 * }
 * ```
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession();

  if (!session) {
    return false;
  }

  return session.user.role === role;
}
