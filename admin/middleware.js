import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

const COOKIE_NAME = 'admin_token';

const ROLE_ROUTE_MAP = {
  SUPREME: '/supreme',
  SUPER_ADMIN: '/super-admin',
  MASTER: '/master',
  USER: '/user',
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow all API paths to pass through to the backend via rewrites
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Public pages: login or root
  if (pathname === '/login' || pathname === '/') {
    if (token) {
      try {
        const payload = decodeJwt(token);
        // Check if token expired
        if (!payload.exp || Date.now() < payload.exp * 1000) {
          const role = payload.role;
          const prefix = ROLE_ROUTE_MAP[role];
          if (prefix) {
            return NextResponse.redirect(new URL(`${prefix}/dashboard`, request.url));
          }
        }
      } catch {
        // Invalid token format, let them see login
      }
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // All other paths require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = decodeJwt(token);
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    const role = payload.role;
    const expectedPrefix = ROLE_ROUTE_MAP[role];

    // For page routes, validate role matches route prefix
    const protectedPrefixes = Object.values(ROLE_ROUTE_MAP);
    const matchedPrefix = protectedPrefixes.find(p => pathname.startsWith(p));

    if (matchedPrefix && matchedPrefix !== expectedPrefix) {
      // User trying to access a route outside their role
      return NextResponse.redirect(new URL(`${expectedPrefix}/dashboard`, request.url));
    }

    return NextResponse.next();
  } catch {
    // Malformed token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
