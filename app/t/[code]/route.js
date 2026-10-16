import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { makeToken } from '../../../lib/auth';
export const dynamic = 'force-dynamic';
// The NFC tag stores /t/<code> permanently. Every tap redirects to a brand-new signed, expiring link.
export async function GET(req, { params }) {
  const { code } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const { data } = await db().from('tags').select('code').eq('code', code).maybeSingle();
  const to = data ? `/v/${makeToken(code)}` : '/v/invalid';
  if (data) await db().from('tag_events').insert({ tag_code: code, action: 'tap' });
  const res = NextResponse.redirect(new URL(to, base), 302);
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  return res;
}
