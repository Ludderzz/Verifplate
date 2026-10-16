import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth';
import { motConfigured } from '../../lib/lookup';
import CreateTag from '../../components/CreateTag';
import { updateTag, refreshTag, disableTag, enableTag, logout } from './actions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin | VeriPlate', robots: { index: false } };
const site = () => process.env.NEXT_PUBLIC_SITE_URL || '';
export default async function Admin({ searchParams }) {
  await requireAdmin(); const sp = await searchParams; const q = (sp.q || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let tq = db().from('tags').select('*').order('created_at', { ascending: false }).limit(200);
  if (q) tq = tq.or(`vin.ilike.%${q}%,plate.ilike.%${q}%,code.eq.${q}`);
  const [{ data: tags = [] }, { data: wl = [] }, { data: ev = [] }] = await Promise.all([tq, db().from('waitlist').select('*').order('created_at', { ascending: false }).limit(500), db().from('tag_events').select('*').order('created_at', { ascending: false }).limit(25)]);
  const totals = wl.reduce((a, w) => a + w.quantity, 0);
  return (
    <div className="adm">
      <nav><span className="logo">Veri<b>Plate</b> admin</span><form action={logout}><button className="btn ghost sm">Sign out</button></form></nav>
      {sp.err && <div className="msg err">{sp.err}</div>}
      {sp.new && <div className="msg good">Tag created. Write this URL to the NFC tag: <span className="mono">{site()}/t/{sp.new}</span></div>}
      <div className="card" style={{ margin: '20px 0' }}><h3>Register a tag</h3>
        <CreateTag lookupOn={motConfigured()} /></div>
      <form className="inl"><input name="q" defaultValue={sp.q || ''} placeholder="Search plate, VIN or tag code" /><button className="btn ghost sm">Search</button></form>
      <h3 style={{ margin: '20px 0 8px' }}>Tags ({tags.length})</h3>
      <table><thead><tr><th>Plate</th><th>VIN</th><th>Status</th><th>Tag URL</th><th>Manage</th></tr></thead><tbody>
        {tags.map((t) => (
          <tr key={t.id}><td><b>{t.plate}</b><br />{[t.colour, t.make, t.model].filter(Boolean).join(' ')}{t.year_of_manufacture ? ` (${t.year_of_manufacture})` : ''}</td><td className="mono">{t.vin}</td>
            <td><span className={`badge ${t.status}`}>{t.status}</span>{t.disabled_reason && <div className="mono">Reason: {t.disabled_reason}</div>}</td>
            <td className="mono">{site()}/t/{t.code}</td>
            <td><details><summary>Edit / flag</summary>
              <form action={updateTag}><input type="hidden" name="code" value={t.code} /><div className="inl"><input name="plate" defaultValue={t.plate} required /><input name="vin" defaultValue={t.vin} required /><input name="make" defaultValue={t.make || ''} placeholder="Make" /><input name="model" defaultValue={t.model || ''} placeholder="Model" /><input name="note" defaultValue={t.note || ''} placeholder="Note" /></div><button className="btn sm">Save (e.g. private plate change)</button></form>
              <form action={refreshTag} style={{ marginTop: 10 }}><input type="hidden" name="code" value={t.code} /><button className="btn ghost sm">Re-check plate</button></form>
              {t.status === 'active'
                ? <form action={disableTag} style={{ marginTop: 10 }}><input type="hidden" name="code" value={t.code} /><input name="reason" placeholder="Reason (required)" required minLength={3} /><button className="btn bad sm" style={{ marginTop: 6 }}>Disable tag</button></form>
                : <form action={enableTag} style={{ marginTop: 10 }}><input type="hidden" name="code" value={t.code} /><input name="why" placeholder="Why re-enable?" required /><button className="btn sm" style={{ marginTop: 6 }}>Re-enable</button></form>}
            </details></td></tr>))}
      </tbody></table>
      <h3 style={{ margin: '36px 0 8px' }}>Recent activity</h3>
      <table><tbody>{ev.map((e) => <tr key={e.id}><td className="mono">{new Date(e.created_at).toLocaleString('en-GB')}</td><td>{e.action}</td><td className="mono">{e.tag_code}</td><td>{e.detail}</td></tr>)}</tbody></table>
      <h3 style={{ margin: '36px 0 8px' }}>Waitlist: {wl.length} people, {totals} tags wanted</h3>
      <table><thead><tr><th>Email</th><th>Qty</th><th>Marketing</th><th>Joined</th></tr></thead><tbody>{wl.map((w) => <tr key={w.id}><td>{w.email}</td><td>{w.quantity}</td><td>{w.marketing_ok ? 'yes' : 'no'}</td><td>{new Date(w.created_at).toLocaleDateString('en-GB')}</td></tr>)}</tbody></table>
    </div>
  );
}
