import { db } from '../../../lib/db';
import { readToken } from '../../../lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Verify vehicle | VeriPlate', robots: { index: false, follow: false }, referrer: 'no-referrer' };
const Box = ({ children }) => <div className="wrap"><div className="vcard">{children}</div></div>;
export default async function Verify({ params }) {
  const t = readToken((await params).token);
  if (!t) return <Box><h2>Tag not recognised</h2><p style={{ color: 'var(--mut)' }}>This tag is not registered with VeriPlate. Treat it with caution.</p></Box>;
  if (t.expired) return <Box><h2>Link expired</h2><p style={{ color: 'var(--mut)' }}>For security, links last 10 minutes. Tap the tag again with your phone to get a fresh one.</p></Box>;
  const { data: tag } = await db().from('tags').select('vin,plate,model,make,colour,year_of_manufacture,fuel_type,status').eq('code', t.code).maybeSingle();
  if (!tag) return <Box><h2>Tag not recognised</h2></Box>;
  if (tag.status === 'disabled') return <Box><span className="badge disabled">DISABLED</span><h2 style={{ marginTop: 12 }}>Do not rely on this tag</h2><div className="warn">This tag has been flagged and disabled by VeriPlate. Do not treat this vehicle as verified. Contact us at [EMAIL] if you are the owner.</div></Box>;
  return (
    <Box>
      <span className="badge active">● TAG ACTIVE</span>
      <p style={{ margin: '18px 0 6px', color: 'var(--mut)' }}>Number plate</p><div className="plate">{tag.plate}</div>
      <p style={{ margin: '22px 0 4px', color: 'var(--mut)' }}>Vehicle</p><p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{[tag.colour, tag.make, tag.model].filter(Boolean).join(' ') || 'Not recorded'}</p>{(tag.year_of_manufacture || tag.fuel_type) && <p style={{ color: 'var(--mut)' }}>{[tag.year_of_manufacture, tag.fuel_type].filter(Boolean).join(' · ')}</p>}
      <p style={{ margin: '18px 0 4px', color: 'var(--mut)' }}>VIN</p><p className="vin">{tag.vin}</p>
      <h2 style={{ fontSize: '1.2rem', margin: '30px 0 12px' }}>Verify this car in 4 steps</h2>
      <ol className="steps">
        <li>Check the car in front of you matches the make, colour and plate above (front and rear plates).</li>
        <li>Find the VIN on the car: base of the windscreen (driver side) or the door pillar sticker. It must match the VIN above exactly.</li>
        <li>Compare with the V5C logbook, which should show the same VIN and plate.</li>
        <li>Optionally run the plate through the free GOV.UK vehicle enquiry to confirm make and colour.</li>
      </ol>
      <div className="warn">If anything does not match, do not proceed and report it to the police or Action Fraud.</div>
      <p style={{ fontSize: '.8rem', color: 'var(--mut)' }}>This link is private and expires in 10 minutes. Verification aid only; it is not an official vehicle record.</p>
    </Box>
  );
}
