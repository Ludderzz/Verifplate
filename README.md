# VeriPlate
1. Supabase: run `supabase/schema.sql` in the SQL editor.
2. `cp .env.example .env.local` and fill it in (service role key stays server-side only).
3. `npm install && npm run dev`, admin at `/admin`.
4. Write `https://YOUR-DOMAIN/t/<code>` (shown in admin) to each NFC tag. Tags redirect to a fresh signed link valid for 10 minutes on every tap.
5. Replace [BRACKETS] in `lib/legal.js` and the [EMAIL] in `app/v/[token]/page.js`; have a solicitor review.
