'use server';
import { db } from '../lib/db';
export async function joinWaitlist(_, fd) {
  if (fd.get('website')) return { ok: true, msg: "You're on the list." }; // honeypot
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const quantity = Number(fd.get('quantity'));
  if (!/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return { msg: 'Please enter a valid email address.' };
  if (![1, 2].includes(quantity)) return { msg: 'Please choose a bundle.' };
  const { error } = await db().from('waitlist').insert({ email, quantity, marketing_ok: fd.get('marketing') === 'on' });
  if (error && error.code !== '23505') return { msg: 'Something went wrong. Please try again.' };
  return { ok: true, msg: "You're on the list. We'll email you when orders open." };
}
