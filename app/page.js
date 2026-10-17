import Link from 'next/link';
import WaitlistForm from '../components/WaitlistForm';
const steps = [['01', 'Stick it on your car', 'Stick it anywhere on your car. We recommend on or near your number plate.'], ['02', 'Anyone taps it', 'A buyer, officer or you hold a phone to the tag. No app needed.'], ['03', 'Verify in seconds', 'See the model, VIN and plate we hold, then follow the steps to check them against the car.']];
const faq = [['Does this stop plate cloning?', 'A cloned plate has no matching tag. Verifying a car takes seconds and exposes mismatches. It is a verification aid, not a guarantee, and does not replace DVLA or V5C checks.'], ['Can someone copy the link?', 'The tag opens a fresh, time limited link on every tap. A copied or shared link expires within minutes.'], ['What if I change my plate?', 'Private plate transfers are supported. Contact us and we update the record.'], ['Where do I stick it?', 'Anywhere on your car. We recommend on or near your number plate.'], ['What do I need to order?', 'When early orders open we will ask for a photo of your V5C and your driving licence, to confirm you are the registered keeper and that the VIN and plate match.'], ['When do orders open?', 'Soon. Waitlist members get first access and launch pricing.']];
export default function Home() {
  return (
    <>
      <div className="wrap">
        <nav><Link href="/" className="logo">Veri<b>Plate</b></Link><a className="btn sm" href="#waitlist">Join waitlist</a></nav>
        <header className="hero">
          <div>
            <span className="pill">Launching soon · UK</span>
            <h1>Tap. Verify. <em>Trust the plate.</em></h1>
            <p className="lead">VeriPlate NFC tags are linked to your car’s VIN. Stick one anywhere on your car and a single tap shows what the car should be, so cloned plates have nowhere to hide.</p>
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
      <section id="early-orders"><div className="wrap">
        <h2>When early orders open</h2><p className="lead">Nothing is needed today. Waitlist members get an email first, and we will ask for:</p>
        <div className="grid3">
          <div className="card"><div className="num">PHOTO 1</div><h3>Your V5C logbook</h3><p>Confirms the VIN, the number plate and that you are the registered keeper.</p></div>
          <div className="card"><div className="num">PHOTO 2</div><h3>Your driving licence</h3><p>Confirms the name on your licence matches the keeper on the V5C.</p></div>
          <div className="card"><div className="num">THEN</div><h3>Stick it on</h3><p>We recommend on or near your number plate, but anywhere on the car works.</p></div>
        </div>
        <p style={{ color: 'var(--mut)', marginTop: 18, fontSize: '.9rem' }}>We only use your documents to verify your order, as explained in our <a href="/legal/privacy">Privacy Policy</a>.</p>
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
