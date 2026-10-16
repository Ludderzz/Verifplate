'use client';
import { useState, useTransition } from 'react';
import { lookupCar, createTag } from '../app/admin/actions';
export default function CreateTag({ lookupOn }) {
  const [plate, setPlate] = useState(''), [make, setMake] = useState(''), [model, setModel] = useState('');
  const [r, setR] = useState(null);
  const [busy, start] = useTransition();
  const run = () => start(async () => { const x = await lookupCar(plate); setR(x); if (x.ok) { setMake(x.make || ''); setModel(x.model || ''); } });
  return (
    <form action={createTag}>
      <div className="inl">
        <input name="plate" value={plate} onChange={(e) => { setPlate(e.target.value.toUpperCase()); setR(null); }} onBlur={() => lookupOn && plate.length >= 2 && !r && !busy && run()} placeholder="Number plate" required />
        {lookupOn && <button type="button" className="btn ghost" disabled={busy || !plate} onClick={run}>{busy ? 'Looking up…' : 'Look up car'}</button>}
        <input name="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Make (auto-filled)" />
        <input name="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model (auto-filled)" />
        <input name="vin" placeholder="VIN (17 chars)" required maxLength={20} />
        <input name="note" placeholder="Internal note" />
        <button className="btn">Create tag</button>
      </div>
      {r?.err && <div className="msg err">{r.err}</div>}
      {r?.ok && <div className="msg good"><b>{r.plate}</b>: {[r.colour, r.make, r.model].filter(Boolean).join(' ')}{r.year_of_manufacture ? `, ${r.year_of_manufacture}` : ''}{r.fuel_type ? `, ${r.fuel_type}` : ''}. Check the VIN against the car or V5C.</div>}
    </form>
  );
}
