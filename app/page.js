import Link from 'next/link';
import WaitlistForm from '../components/WaitlistForm';
const steps = [['01', 'We link your tag', 'Each tag is registered to your car’s VIN and number plate in our system.'], ['02', 'Anyone taps it', 'A buyer, officer or you hold a phone to the tag. No app needed.'], ['03', 'Verify in seconds', 'See the model, VIN and plate we hold, then follow the steps to check them against the car.']];
const faq = [['Does this stop plate cloning?', 'A cloned plate has no matching tag. Verifying a car takes seconds and exposes mismatches. It is a verification aid, not a guarantee, and does not replace DVLA or V5C checks.'], ['Can someone copy the link?', 'The tag opens a fresh, time limited link on every tap. A copied or shared link expires within minutes.'], ['What if I change my plate?', 'Private plate transfers are supported. Contact us and we update the record.'], ['When do orders open?', 'Soon. Waitlist members get first access and launch pricing.']];
export default function Home() {
  return (
    <>
      <div className="wrap">
        <nav><Link href="/" className="logo">Veri<b>Plate</b></Link><a className="btn sm" href="#waitlist">Join waitlist</a></nav>
        <header className="hero">
          <div>
            <span className="pill">Launching soon · UK</span>
            <h1>Tap. Verify. <em>Trust the plate.</em></h1>
            <p className="lead">VeriPlate NFC tags are linked to your car’s VIN. One tap shows what the car should be, so cloned plates have nowhere to hide.</p>
            <a className="btn" href="#waitlist">Get early access from £10</a> <a className="btn ghost" href="#how">How it works</a>
          </div>
          <div className="stage" aria-hidden="true">
            <span className="ring" /><span className="ring" /><span className="ring" />
            <div className="phone"><i />
              <div className="row"><small>Model</small><span>Ford Focus ST-Line</span></div>
              <div className="row"><small>Plate</small><span>AB12 CDE</span></div>
              <div className="row"><small>VIN</small><span style={{ fontSize: '.72rem' }}>WF0XXXGCDX•••••••</span></div>
              <div className="ok">● Tag active</div>
            </div>
            <div className="tag">NFC</div>
          </div>
        </header>
      </div>
      <section id="how"><div className="wrap">
        <h2>Verification in three steps</h2><p className="lead">No app, no account. Works on modern iPhones and Android phones.</p>
        <div className="grid3">{steps.map(([n, t, d]) => <div className="card" key={n}><div className="num">{n}</div><h3>{t}</h3><p>{d}</p></div>)}</div>
      </div></section>
      <section><div className="wrap center">
        <h2>Simple launch pricing</h2><p className="lead" style={{ margin: '0 auto 36px' }}>Reserve yours on the waitlist. Nothing to pay today.</p>
        <div className="grid3" style={{ gridTemplateColumns: 'repeat(2,minmax(0,360px))', justifyContent: 'center' }}>
          <div className="card"><div className="num">SINGLE</div><div className="price">£10</div><p>1 tag linked to your VIN and plate.</p></div>
          <div className="card hot"><div className="num">TWO TAGS</div><div className="price">£15 <small>save £5</small></div><p>2 tags, one for a second car or a spare.</p></div>
        </div>
      </div></section>
      <section id="waitlist"><div className="wrap center">
        <h2>Join the waitlist</h2><p className="lead" style={{ margin: '0 auto' }}>Be first when orders open.</p>
        <WaitlistForm />
      </div></section>
      <section><div className="wrap" style={{ maxWidth: 760 }}>
        <h2>Questions</h2>{faq.map(([q, a]) => <details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div></section>
      <div className="wrap"><footer><span>© {new Date().getFullYear()} VeriPlate</span><span><a href="/legal/privacy">Privacy</a><a href="/legal/refunds">Refunds</a><a href="/legal/terms">Terms</a></span></footer></div>
    </>
  );
}
