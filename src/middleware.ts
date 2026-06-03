import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const session = token ? await decryptSession(token) : null;
  const { pathname } = request.nextUrl;

  // Protect Admin panel
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Seller pages
  if (pathname.startsWith('/seller')) {
    if (!session || session.role !== 'SELLER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Buyer operations
  if (pathname.startsWith('/buyer')) {
    if (!session || session.role !== 'BUYER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/buyer/:path*'],
};