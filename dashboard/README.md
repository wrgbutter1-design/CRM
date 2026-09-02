# Serpaco CRM dashboard

A Next.js app for tracking customers and jobs, backed by the Supabase
project in `../supabase`. No login yet — the database's RLS policies are
temporarily open (see `supabase/migrations/20260902174000_relax_rls_for_no_auth_dashboard.sql`),
so anything at these URLs can read and write the data. Fine for local
development and a private first look; not something to deploy publicly as-is.

## Pages

- `/` — customer list, with an inline "Add a customer" form
- `/customers/[id]` — one customer's details, their jobs, job notes, and
  forms to add a job or a note
- `/jobs` — every job across every customer, filterable by status

## Running it

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY —
# see ../supabase/SETUP.md for the project URL, and Project Settings → API
# in the Supabase dashboard for the anon/publishable key.
npm install
npm run dev
```

Then open http://localhost:3000.

`npm run build` and `npm run lint` both pass as of the last commit.

## A note on this sandbox

This app was built and type-checked inside a Claude Code remote session,
whose network egress policy blocks the container from reaching
`*.supabase.co` directly — so the dev server couldn't be exercised against
the live database from inside that sandbox. That's a property of the
sandbox, not the app: running `npm run dev` on a normal machine (or your own
laptop) reaches Supabase over the open internet like any other app. If you
hit an issue that isn't reproducible locally, mention that context.

## Next steps

- Real auth (Supabase Auth) so the "open access" RLS policies can be
  tightened back to authenticated-only.
- Job documents: wire up the `job_documents` table to actual Google Drive
  links.
