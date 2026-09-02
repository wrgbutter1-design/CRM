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

`npm run build` and `npm run lint` both pass as of the last commit. The dev
server has also been run and verified end-to-end against the live database
(customer list, job list with status filters, and a customer detail page all
render real data).

## A note on this sandbox

Claude Code sessions run in a network-sandboxed cloud environment by
default (Trusted access: package registries and a few other allowlisted
domains, nothing else), so exercising this app against Supabase from inside
one requires adding `*.supabase.co` to that environment's **Custom** network
access list first. See [Configure cloud environments](https://code.claude.com/docs/en/cloud-environments#network-access)
if you hit the same thing.

## Next steps

- Real auth (Supabase Auth) so the "open access" RLS policies can be
  tightened back to authenticated-only.
- Job documents: wire up the `job_documents` table to actual Google Drive
  links.
