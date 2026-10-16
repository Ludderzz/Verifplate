'use server';
import { revalidatePath } from 'next/cache';
import { db } from '../../lib/db';
import { requireAdmin, endSession, newCode } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { lookupPlate } from '../../lib/lookup';
const VIN = /^[A-HJ-NPR-Z0-9]{17}$/;
const clean = (fd) => ({ vin: String(fd.get('vin') || '').toUpperCase().replace(/\s/g, ''), plate: String(fd.get('plate') || '').toUpperCase().replace(/\s/g, ''), make: String(fd.get('make') || '').trim() || null, model: String(fd.get('model') || '').trim() || null, note: String(fd.get('note') || '').trim() || null });
const log = (tag_code, action, detail) => db().from('tag_events').insert({ tag_code, action, detail });
const bad = (m) => redirect('/admin?err=' + encodeURIComponent(m));
function check(v) { if (!VIN.test(v.vin)) bad('VIN must be 17 characters (no I, O or Q)'); if (!/^[A-Z0-9]{2,8}$/.test(v.plate)) bad('Plate looks invalid'); }

export async function lookupCar(plateRaw) {
  await requireAdmin();
  const plate = String(plateRaw || '').toUpperCase().replace(/\s/g, '');
  if (!/^[A-Z0-9]{2,8}$/.test(plate)) return { err: 'Enter a valid number plate first' };
  const d = await lookupPlate(plate);
  if (d.skipped) return { err: 'Plate lookup is off: set the five MOT_* values in .env.local' };
  if (d.notFound) return { err: `No MOT record found for ${plate}. Check for typos (very new cars may not be listed yet). You can type the details in manually.` };
  if (d.error) return { err: `Lookup failed${d.why ? ': ' + d.why : ''}. Check the keys in .env.local and restart the server.` };
  return { ok: true, plate, ...d.data, ...d.info };
}
export async function createTag(fd) {
  await requireAdmin(); const v = clean(fd); check(v);
  const code = newCode();
  const d = await lookupPlate(v.plate);
  const { error } = await db().from('tags').insert({ code, ...(d.data || {}), ...v, make: v.make || d.data?.make || null, model: v.model || d.data?.model || null }); if (error) bad(error.message);
  await log(code, 'created', `${v.plate} / ${v.vin}`); revalidatePath('/admin'); redirect('/admin?new=' + code);
}
export async function updateTag(fd) {
  await requireAdmin(); const v = clean(fd); check(v); const code = String(fd.get('code'));
  const { data: old } = await db().from('tags').select('vin,plate').eq('code', code).single();
  let dv = {};
  if (old?.plate !== v.plate) { const d = await lookupPlate(v.plate); dv = d.data || { make: null, colour: null, year_of_manufacture: null, fuel_type: null, dvla_checked_at: null }; }
  const { error } = await db().from('tags').update({ ...v, ...dv, updated_at: new Date().toISOString() }).eq('code', code); if (error) bad(error.message);
  await log(code, 'updated', `plate ${old?.plate} → ${v.plate}; vin ${old?.vin} → ${v.vin}`); revalidatePath('/admin');
}
export async function disableTag(fd) {
  await requireAdmin(); const reason = String(fd.get('reason') || '').trim(); const code = String(fd.get('code'));
  if (reason.length < 3) bad('A reason is required to disable a tag');
  await db().from('tags').update({ status: 'disabled', disabled_reason: reason, disabled_at: new Date().toISOString() }).eq('code', code);
  await log(code, 'disabled', reason); revalidatePath('/admin');
}
export async function enableTag(fd) {
  await requireAdmin(); const code = String(fd.get('code'));
  await db().from('tags').update({ status: 'active', disabled_reason: null, disabled_at: null }).eq('code', code);
  await log(code, 'enabled', String(fd.get('why') || 'Re-enabled')); revalidatePath('/admin');
}
export async function logout() { await endSession(); redirect('/admin/login'); }
export async function refreshTag(fd) {
  await requireAdmin(); const code = String(fd.get('code'));
  const { data: t } = await db().from('tags').select('plate,model').eq('code', code).single();
  const d = await lookupPlate(t.plate);
  if (d.skipped) bad('Plate lookup is off: set the five MOT_* values in .env.local');
  if (d.notFound) bad('No MOT record found for that plate');
  if (d.error) bad('Lookup failed' + (d.why ? ': ' + d.why : ''));
  await db().from('tags').update({ ...d.data, model: t.model || d.data.model || null }).eq('code', code); await log(code, 'dvla_refresh', `${d.data.make} ${d.data.colour}`); revalidatePath('/admin');
}
