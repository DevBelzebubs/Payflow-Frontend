import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/api/auth/login', '/api/auth/register', '/api/auth/verify'];
const AUTH_REQUIRED_ROUTES = ['/dashboard', '/api/clientes', '/api/ordenes', '/api/cuentas-bancarias'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith('/_next') || pathname.startsWith('/favicon'));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isAuthRequired = AUTH_REQUIRED_ROUTES.some(route => pathname.startsWith(route));
  if (!isAuthRequired) {
    return NextResponse.next();
  }

  const token = request.cookies.get('payflow_token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
