// DVSA MOT History API (OAuth2 client credentials). Gives make AND model, plus a VIN-to-plate cross-check.
const e = process.env;
let tok = { v: null, exp: 0 };
export const motConfigured = () => ['MOT_CLIENT_ID', 'MOT_CLIENT_SECRET', 'MOT_API_KEY', 'MOT_SCOPE_URL', 'MOT_TOKEN_URL'].every((k) => e[k]);

async function token() {
  if (tok.v && tok.exp > Date.now() + 60000) return tok.v; // cached until a minute before expiry
  const r = await fetch(e.MOT_TOKEN_URL, {
    method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: e.MOT_CLIENT_ID, client_secret: e.MOT_CLIENT_SECRET, scope: e.MOT_SCOPE_URL }),
  });
  if (!r.ok) { console.error('[MOT] token request failed', r.status, (await r.text()).slice(0, 300)); throw new Error('token ' + r.status); }
  const j = await r.json(); tok = { v: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return tok.v;
}
async function get(path) {
  if (!motConfigured()) return { skipped: true };
  try {
    const r = await fetch(`https://history.mot.api.gov.uk/v1/trade/vehicles/${path}`, { cache: 'no-store', headers: { Authorization: `Bearer ${await token()}`, 'X-API-Key': e.MOT_API_KEY, Accept: 'application/json' } });
    if (r.status === 404) return { notFound: true };
    if (!r.ok) { console.error('[MOT] API error', r.status, (await r.text()).slice(0, 300)); return { error: true, why: `MOT API ${r.status}` }; }
    const j = await r.json(); return { json: Array.isArray(j) ? j[0] : j };
  } catch (err) { return { error: true, why: String(err.message).startsWith('token') ? `MOT login failed (${String(err.message).slice(6)})` : 'MOT network error (check MOT_TOKEN_URL)' }; }
}
export async function motByPlate(plate) {
  const r = await get(`registration/${encodeURIComponent(plate)}`);
  if (!r.json) return r;
  const j = r.json;
  return { data: { make: j.make || null, model: j.model || null, colour: j.primaryColour || null, fuel: j.fuelType || null, year: Number(String(j.manufactureDate || j.firstUsedDate || '').slice(0, 4)) || null }, mileage: analyseMileage(j.motTests) };
}
// Does the MOT record for this VIN list the same plate? Not found is normal for brand-new cars.
export async function checkVin(vin, plate) {
  const r = await get(`vin/${encodeURIComponent(vin)}`);
  if (!r.json) return { status: r.notFound ? 'notfound' : 'unknown' };
  const reg = String(r.json.registration || '').toUpperCase().replace(/\s/g, '');
  return { status: !reg ? 'unknown' : reg === plate ? 'match' : 'mismatch', registration: reg };
}

// Flags odometer anomalies across MOT tests. Indicators only, not proof of clocking.
const day = (v) => Date.parse(String(v || '').replace(/^(\d{4})\.(\d{2})\.(\d{2})/, '$1-$2-$3'));
const fmt = (n) => n.toLocaleString('en-GB');
export function analyseMileage(tests) {
  tests = Array.isArray(tests) ? tests : [];
  const flags = [];
  const rows = tests
    .filter((t) => t.odometerValue != null && t.odometerValue !== '' && !['UNREADABLE', 'NO_ODOMETER'].includes(t.odometerResultType))
    .map((t) => ({ d: day(t.completedDate), mi: Math.round(Number(t.odometerValue) * (String(t.odometerUnit || 'MI').toUpperCase().startsWith('K') ? 0.621371 : 1)) }))
    .filter((r) => r.d && Number.isFinite(r.mi)).sort((a, b) => a.d - b.d);
  const bad = tests.filter((t) => ['UNREADABLE', 'NO_ODOMETER'].includes(t.odometerResultType)).length;
  if (bad) flags.push(`Odometer was unreadable or missing at ${bad} MOT test${bad > 1 ? 's' : ''}`);
  for (let i = 1; i < rows.length; i++) {
    const p = rows[i - 1], c = rows[i], on = new Date(c.d).toLocaleDateString('en-GB');
    const yrs = Math.max((c.d - p.d) / 3.15576e10, 1 / 12);
    if (c.mi < p.mi - 100) flags.push(`Mileage went DOWN from ${fmt(p.mi)} to ${fmt(c.mi)} miles (test on ${on})`);
    else if ((c.mi - p.mi) / yrs > 40000) flags.push(`Unusually high mileage: ${fmt(c.mi - p.mi)} miles in ${yrs.toFixed(1)} years (test on ${on})`);
    else if (c.mi - p.mi <= 10 && (c.d - p.d) / 864e5 > 180) flags.push(`Mileage unchanged (${fmt(c.mi)}) over ${Math.round((c.d - p.d) / 2.63e9)} months (test on ${on})`);
  }
  return { flags, readings: rows.length, last: rows.length ? rows[rows.length - 1].mi : null };
}
