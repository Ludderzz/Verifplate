// Plate lookup via the free DVSA MOT History API (OAuth2 client credentials). Returns make, model, colour, fuel, year.
const e = process.env;
let tok = { v: null, exp: 0 };
export const motConfigured = () => ['MOT_CLIENT_ID', 'MOT_CLIENT_SECRET', 'MOT_API_KEY', 'MOT_SCOPE_URL', 'MOT_TOKEN_URL'].every((k) => e[k]);
const tc = (s) => (!s ? null : s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : s);

async function token() {
  if (tok.v && tok.exp > Date.now() + 60000) return tok.v;
  const r = await fetch(e.MOT_TOKEN_URL, {
    method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: e.MOT_CLIENT_ID, client_secret: e.MOT_CLIENT_SECRET, scope: e.MOT_SCOPE_URL }),
  });
  if (!r.ok) { console.error('[MOT] token request failed', r.status, (await r.text()).slice(0, 300)); throw new Error('token ' + r.status); }
  const j = await r.json(); tok = { v: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return tok.v;
}
export async function lookupPlate(plate) {
  if (!motConfigured()) return { skipped: true };
  try {
    const r = await fetch(`https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${encodeURIComponent(plate)}`, {
      cache: 'no-store', headers: { Authorization: `Bearer ${await token()}`, 'X-API-Key': e.MOT_API_KEY, Accept: 'application/json' },
    });
    if (r.status === 404) return { notFound: true };
    if (!r.ok) { console.error('[MOT] API error', r.status, (await r.text()).slice(0, 300)); return { error: true, why: `MOT API ${r.status}` }; }
    let j = await r.json(); if (Array.isArray(j)) j = j[0];
    return { data: { make: tc(j.make), model: tc(j.model), colour: tc(j.primaryColour), fuel_type: tc(j.fuelType), year_of_manufacture: Number(String(j.manufactureDate || j.firstUsedDate || '').slice(0, 4)) || null, dvla_checked_at: new Date().toISOString() } };
  } catch (err) { return { error: true, why: String(err.message).startsWith('token') ? `MOT login failed (${String(err.message).slice(6)})` : 'MOT network error (check MOT_TOKEN_URL)' }; }
}
