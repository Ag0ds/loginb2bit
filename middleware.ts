import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/profile'];
const PUBLIC_ONLY_PATHS = ['/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access = req.cookies.get('access_token')?.value;

  if (PUBLIC_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    if (access) {
      const url = req.nextUrl.clone();
      url.pathname = '/profile';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    if (!access) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/profile'],
};
