import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/profile'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const access = req.cookies.get('access_token')?.value;
  if (!access) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/profile'],
};
