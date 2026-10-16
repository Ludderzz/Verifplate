// Optional DVLA Vehicle Enquiry lookup (colour, make, year, fuel). Skipped automatically when DVLA_API_KEY is blank.
export async function lookupPlate(plate) {
  const key = process.env.DVLA_API_KEY;
  if (!key) return { skipped: true };
  try {
    const r = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
      method: 'POST', cache: 'no-store', headers: { 'x-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationNumber: plate }),
    });
    if (r.status === 404) return { notFound: true };
    if (!r.ok) { console.error('[DVLA] API error', r.status); return { error: true, why: `DVLA ${r.status}` }; }
    const d = await r.json();
    return { data: { make: d.make || null, colour: d.colour || null, year_of_manufacture: d.yearOfManufacture || null, fuel_type: d.fuelType || null, dvla_checked_at: new Date().toISOString() }, info: { tax: d.taxStatus, mot: d.motStatus } };
  } catch { return { error: true, why: 'DVLA network error' }; }
}
