-- TEMPORARY: the dashboard has no login yet, so open access to anon too.
-- RLS stays ON (so tightening this later is just swapping the policy back),
-- but for now any request — signed in or not — can read/write.
--
-- TODO: once the dashboard has real auth, drop these and restore the
-- "authenticated full access" policies from 20260902172500_init_schema.sql.

drop policy "authenticated full access" on customers;
drop policy "authenticated full access" on jobs;
drop policy "authenticated full access" on job_notes;
drop policy "authenticated full access" on job_documents;

create policy "open access (no auth yet)" on customers for all using (true) with check (true);
create policy "open access (no auth yet)" on jobs for all using (true) with check (true);
create policy "open access (no auth yet)" on job_notes for all using (true) with check (true);
create policy "open access (no auth yet)" on job_documents for all using (true) with check (true);
