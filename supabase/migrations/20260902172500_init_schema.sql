-- Core schema for the CRM: customers, their jobs, and everything tied to a job.
-- Written for a small service/trade business tracking current and past work.

create extension if not exists "pgcrypto";

-- Keeps updated_at current on any row update, on every table below.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  phone text,
  email text,
  billing_address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();

create index customers_name_idx on customers using gin (to_tsvector('english', name || ' ' || coalesce(company_name, '')));

-- ---------------------------------------------------------------------------
-- jobs
-- ---------------------------------------------------------------------------
create type job_status as enum ('quoted', 'scheduled', 'in_progress', 'completed', 'cancelled');

create table jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  title text not null,
  description text,
  status job_status not null default 'quoted',
  site_address text,
  quoted_amount numeric(12, 2),
  final_amount numeric(12, 2),
  scheduled_date date,
  completed_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger jobs_set_updated_at
  before update on jobs
  for each row execute function set_updated_at();

create index jobs_customer_id_idx on jobs (customer_id);
create index jobs_status_idx on jobs (status);
create index jobs_scheduled_date_idx on jobs (scheduled_date);

-- ---------------------------------------------------------------------------
-- job_notes  (site visit notes, status updates, call logs)
-- ---------------------------------------------------------------------------
create table job_notes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  author text not null,
  note text not null,
  created_at timestamptz not null default now()
);

create index job_notes_job_id_idx on job_notes (job_id);

-- ---------------------------------------------------------------------------
-- job_documents  (pointers into Google Drive: quotes, contracts, photos)
-- ---------------------------------------------------------------------------
create table job_documents (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  label text not null,
  drive_url text not null,
  uploaded_at timestamptz not null default now()
);

create index job_documents_job_id_idx on job_documents (job_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Internal tool: any signed-in team member can read and write everything.
-- ---------------------------------------------------------------------------
alter table customers enable row level security;
alter table jobs enable row level security;
alter table job_notes enable row level security;
alter table job_documents enable row level security;

create policy "authenticated full access" on customers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on jobs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on job_notes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on job_documents
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
