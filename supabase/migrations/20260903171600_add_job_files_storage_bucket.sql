-- Storage for job-site photos and receipt images. Public read (object keys
-- are unguessable UUIDs, and everything linking to them already sits behind
-- login), writes restricted to signed-in users.
insert into storage.buckets (id, name, public)
values ('job-files', 'job-files', true)
on conflict (id) do nothing;

create policy "Public read access" on storage.objects
  for select using (bucket_id = 'job-files');

create policy "Authenticated upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'job-files');

create policy "Authenticated delete" on storage.objects
  for delete to authenticated using (bucket_id = 'job-files');
