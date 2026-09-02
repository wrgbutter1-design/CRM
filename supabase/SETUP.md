# Provisioning the Supabase project

The schema lives in this repo as a migration (`supabase/migrations/20260902172500_init_schema.sql`)
and is ready to apply. Creating the actual hosted project requires your Supabase
account, so that one step is on you — everything else is done.

## Option A — let Claude Code apply the migration (recommended)

1. Go to [supabase.com/dashboard/new](https://supabase.com/dashboard/new) and create a project
   (pick any name, e.g. "crm"; save the database password it gives you).
2. Once it's provisioned, open **Project Settings → Database** and copy the
   **connection string** (URI format, "Session pooler" or direct connection).
3. Paste that connection string here in the chat (or just the DB password, if
   you'd rather keep the string private — either works).
4. Claude Code runs `supabase link` and `supabase db push` to apply the schema
   above to your new project.

## Option B — do it yourself, no CLI needed

1. Create the project as in step 1 above.
2. Open the project's **SQL Editor**.
3. Paste in the full contents of `supabase/migrations/20260902172500_init_schema.sql`
   and run it.
4. Grab the **Project URL** and **anon public key** from Project Settings → API —
   the dashboard app will need those.

## What gets created

Four tables: `customers`, `jobs` (linked to a customer, with a status —
quoted / scheduled / in_progress / completed / cancelled), `job_notes` (site
visit notes and call logs per job), and `job_documents` (links out to the
Google Drive files for a job — quotes, contracts, photos). Row Level Security
is on for all four; any signed-in team member can read and write everything,
which is what an internal single-team CRM needs.

## After it's live

Next step is wiring the Postgres MCP server into Claude Code so this session
can query and update job data directly, and starting on the Next.js dashboard.
