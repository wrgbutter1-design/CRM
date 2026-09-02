# The Supabase project

**Status: live.** Project `crm` was created via the Supabase MCP connector and
the schema below is applied.

- Organization: Serpaco CRM
- Project ref: `fvvqwqsiajvqopxebluh`
- Region: us-east-1
- Project URL: `https://fvvqwqsiajvqopxebluh.supabase.co`
- Plan: Free ($0/month)
- Publishable (anon) key: available via Project Settings → API in the
  Supabase dashboard, or the `get_publishable_keys` MCP tool — not written
  here since it's safe for client code but still project-specific config,
  not something to hardcode into a committed doc.

Migrations are tracked in `supabase/migrations/` and applied in order:

1. `20260902172500_init_schema.sql` — customers, jobs, job_notes, job_documents, RLS
2. `20260902173100_fix_set_updated_at_search_path.sql` — closes a security lint
   on the shared `set_updated_at` trigger function

Security advisors are clean (`get_advisors` returns no lints) as of the last
migration.

## What gets created

Four tables: `customers`, `jobs` (linked to a customer, with a status —
quoted / scheduled / in_progress / completed / cancelled), `job_notes` (site
visit notes and call logs per job), and `job_documents` (links out to the
Google Drive files for a job — quotes, contracts, photos). Row Level Security
is on for all four; any signed-in team member can read and write everything,
which is what an internal single-team CRM needs.

## Next step

The Supabase MCP connector (already enabled in this chat) gives Claude Code
direct read/write access to this database — no separate Postgres MCP server
needed. What's left is the Next.js dashboard so your dad's team has a browser
UI, rather than going through Claude Code for every lookup.
