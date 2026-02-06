import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];
const PUBLIC_PREFIXES = ['/_next/', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      const session = await verifyToken(token);
      if (session) {
        return NextResponse.redirect(new URL('/docs/가이드/0-사전설치/curriculum', request.url));
      }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const protectedPaths = ['/docs', '/upload', '/designs'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyToken(token);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
