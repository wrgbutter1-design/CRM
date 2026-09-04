-- Job costing: materials receipts and labor spend, per job.
create type expense_category as enum ('materials', 'labor');

create table job_expenses (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  category expense_category not null,
  description text not null,
  amount numeric(12, 2) not null,
  receipt_url text,
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index job_expenses_job_id_idx on job_expenses (job_id);

alter table job_expenses enable row level security;
create policy "authenticated full access" on job_expenses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- job_documents was written around pasted Drive links; it now also holds
-- directly-uploaded job-site photos, so the column name should stop
-- implying Drive specifically.
alter table job_documents rename column drive_url to url;
