-- Tracks who ran each job. A lookup table (not free text on jobs) so a
-- decade of records from multiple job leaders can be filtered/reported on
-- reliably, instead of drifting across spelling variants of the same name.

create table job_leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table jobs add column job_leader_id uuid references job_leaders(id);
create index jobs_job_leader_id_idx on jobs (job_leader_id);

alter table job_leaders enable row level security;
create policy "open access (no auth yet)" on job_leaders for all using (true) with check (true);
