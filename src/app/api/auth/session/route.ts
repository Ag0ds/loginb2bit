import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { access, refresh } = await req.json().catch(() => ({}));
  const res = NextResponse.json({ ok: true });
  const common = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  if (access) res.cookies.set('access_token', access, common);
  if (refresh) res.cookies.set('refresh_token', refresh, common);

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('access_token', '', { path: '/', expires: new Date(0) });
  res.cookies.set('refresh_token', '', { path: '/', expires: new Date(0) });
  return res;
}
