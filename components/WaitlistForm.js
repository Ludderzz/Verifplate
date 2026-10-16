'use client';
import { useActionState } from 'react';
import { joinWaitlist } from '../app/actions';
export default function WaitlistForm() {
  const [s, act, pending] = useActionState(joinWaitlist, null);
  if (s?.ok) return <div className="msg good center">{s.msg}</div>;
  return (
    <form action={act} className="form">
      <label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
      <label>Bundle<select name="quantity" defaultValue="2"><option value="1">1 tag for £10</option><option value="2">2 tags for £15 (best value)</option></select></label>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
      <label className="chk"><input type="checkbox" name="marketing" /><span>Email me launch news and offers (optional, unsubscribe anytime)</span></label>
      <p style={{ fontSize: '.8rem', color: 'var(--mut)' }}>No payment now. See our <a href="/legal/privacy">Privacy Policy</a>.</p>
      {s?.msg && <div className="msg err">{s.msg}</div>}
      <button className="btn" disabled={pending}>{pending ? 'Joining…' : 'Join the waitlist'}</button>
    </form>
  );
}
