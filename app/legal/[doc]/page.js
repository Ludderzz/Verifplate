import { notFound } from 'next/navigation';
import Link from 'next/link';
import { legal } from '../../../lib/legal';
export async function generateStaticParams() { return Object.keys(legal).map((doc) => ({ doc })); }
export default async function Legal({ params }) {
  const d = legal[(await params).doc]; if (!d) notFound();
  return (
    <div className="wrap"><nav><Link href="/" className="logo">Veri<b>Plate</b></Link></nav>
      <article className="doc"><h1 style={{ fontSize: '2.4rem' }}>{d.title}</h1><p>Last updated: {d.updated}</p>
        {d.sections.map(([h, t], i) => <section key={h} style={{ padding: 0 }}><h2>{i + 1}. {h}</h2><p>{t}</p></section>)}
      </article></div>
  );
}
