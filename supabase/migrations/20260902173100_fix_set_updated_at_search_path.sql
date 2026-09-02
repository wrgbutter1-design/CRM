-- Pin the trigger function's search_path to close a Supabase security lint
-- (function_search_path_mutable). The function touches no schema objects
-- by name, so an empty search_path is safe.

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = '';
