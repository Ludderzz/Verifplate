import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const sign = (s) => crypto.createHmac('sha256', process.env.TOKEN_SECRET).update(s).digest('base64url');
const safeEq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };

// Rolling verify link: new random nonce + 10 minute expiry on every tap.
export function makeToken(code, ttl = 600) {
  const p = `${code}.${Math.floor(Date.now() / 1000) + ttl}.${crypto.randomBytes(6).toString('base64url')}`;
  return `${p}.${sign(p)}`;
}
export function readToken(t = '') {
  const s = t.split('.');
  if (s.length !== 4 || !safeEq(sign(s.slice(0, 3).join('.')), s[3])) return null;
  return +s[1] < Date.now() / 1000 ? { expired: true } : { code: s[0] };
}
export const newCode = () => crypto.randomBytes(9).toString('base64url');

export function checkPassword(pw = '') {
  const h = (v) => crypto.createHash('sha256').update(v).digest('base64url');
  return safeEq(h(pw), h(process.env.ADMIN_PASSWORD || ''));
}
export async function startSession() {
  const exp = Math.floor(Date.now() / 1000) + 8 * 3600;
  (await cookies()).set('vp_admin', `${exp}.${sign('admin' + exp)}`, { httpOnly: true, secure: true, sameSite: 'strict', path: '/admin', maxAge: 8 * 3600 });
}
export async function endSession() { (await cookies()).delete({ name: 'vp_admin', path: '/admin' }); }
export async function requireAdmin() {
  const v = (await cookies()).get('vp_admin')?.value || '';
  const [exp, sig] = v.split('.');
  if (!exp || !sig || +exp < Date.now() / 1000 || !safeEq(sign('admin' + exp), sig)) redirect('/admin/login');
}
