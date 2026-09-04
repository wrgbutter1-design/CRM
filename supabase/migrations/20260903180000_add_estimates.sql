-- Field estimates: what a job leader writes up (and photographs, from
-- paper notes) at a property before a job exists. Lives on the customer,
-- not a job, since a job doesn't exist yet at estimate time.
create table estimates (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  site_address text,
  notes text,
  estimated_amount numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger estimates_set_updated_at
  before update on estimates
  for each row execute function set_updated_at();

create index estimates_customer_id_idx on estimates (customer_id);

create table estimate_documents (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references estimates(id) on delete cascade,
  label text not null,
  url text not null,
  uploaded_at timestamptz not null default now()
);

create index estimate_documents_estimate_id_idx on estimate_documents (estimate_id);

alter table estimates enable row level security;
alter table estimate_documents enable row level security;

create policy "authenticated full access" on estimates
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on estimate_documents
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
