-- The dashboard now has real login (Supabase Auth, admin-created accounts),
-- so the "open access (no auth yet)" policies from the no-login first pass
-- can be replaced with the original authenticated-only ones. Covers all
-- five tables, including job_leaders which didn't exist for the original
-- authenticated-only policy.

drop policy "open access (no auth yet)" on customers;
drop policy "open access (no auth yet)" on jobs;
drop policy "open access (no auth yet)" on job_notes;
drop policy "open access (no auth yet)" on job_documents;
drop policy "open access (no auth yet)" on job_leaders;

create policy "authenticated full access" on customers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on jobs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on job_notes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on job_documents
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on job_leaders
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
