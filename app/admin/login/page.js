import { redirect } from 'next/navigation';
import { checkPassword, startSession } from '../../../lib/auth';
export const metadata = { title: 'Admin', robots: { index: false } };
export default async function Login({ searchParams }) {
  const bad = (await searchParams).e;
  async function go(fd) { 'use server'; if (!checkPassword(String(fd.get('pw')))) redirect('/admin/login?e=1'); await startSession(); redirect('/admin'); }
  return <form action={go} className="form" style={{ marginTop: 120, padding: 24 }}><h2>VeriPlate admin</h2>{bad && <div className="msg err">Wrong password</div>}<input type="password" name="pw" placeholder="Password" required autoFocus /><button className="btn">Sign in</button></form>;
}
