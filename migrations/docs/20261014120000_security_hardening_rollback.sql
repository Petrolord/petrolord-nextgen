-- ROLLBACK for migrations/20261014120000_security_hardening.sql.
-- Restores the pre-migration state captured from production on 2026-10-14
-- (pg_policies, pg_proc ACLs and pg_get_functiondef). No transaction
-- control: run with `supabase db query --linked -f <this file>`.
-- Policy creates are not idempotent; run once, after the migration.

drop policy if exists notifications_insert_self_or_admin on public.notifications;
create policy "System can insert notifications" on public.notifications
  for insert to public with check (true);
drop policy if exists audit_logs_insert_own on public.audit_logs;
create policy "Allow service role to insert audit logs" on public.audit_logs
  for insert to public with check (true);
create policy "Allow authenticated insert audit logs" on public.audit_logs
  for insert to public with check (auth.role() = 'authenticated'::text);
create policy "Authenticated users can insert audit logs" on public.audit_logs
  for insert to public with check (auth.role() = 'authenticated'::text);
alter table public.audit_logs alter column user_id drop default;
create policy "Allow service-role to insert logs" on public.email_logs
  for insert to public with check (true);
drop policy if exists analytics_events_insert_own on public.analytics_events;
create policy "Insert events" on public.analytics_events
  for insert to public with check (true);
grant execute on function public.academy_scope(uuid, text) to public, anon, authenticated;
grant execute on function public.academy_quota(uuid, text) to public, anon, authenticated;
grant execute on function public.academy_is_activated(uuid) to authenticated;
grant execute on function public.academy_has_prereq_waiver(uuid, text) to authenticated;
grant execute on function public.academy_setting_text(text, text) to public, anon, authenticated;
grant execute on function public.academy_setting_int(text, integer) to public, anon, authenticated;
alter function public.get_user_role() reset search_path;
alter function public.is_super_admin() reset search_path;

CREATE OR REPLACE FUNCTION public.academy_quota(p_user uuid, p_app text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select q.quotas from public.academy_scope_quotas q
   where q.scope = public.academy_scope(p_user, p_app)
     and q.app_slug in (p_app, '*')
   order by (q.app_slug = p_app) desc
   limit 1;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role text;
  v_display_name text;
  v_phase integer;
begin
  v_role := new.raw_app_meta_data->>'role';               -- server-set only
  if v_role is null then
    if new.raw_user_meta_data->>'role' in ('student', 'lecturer') then
      v_role := new.raw_user_meta_data->>'role';          -- legacy admin import
    else
      v_role := 'learner';                                -- base identity
    end if;
  end if;

  v_display_name := coalesce(new.raw_user_meta_data->>'display_name',
                             split_part(new.email, '@', 1));
  begin
    v_phase := (new.raw_user_meta_data->>'phase')::integer;
  exception when others then
    v_phase := 1;
  end;
  v_phase := coalesce(v_phase, 1);

  insert into public.profiles
      (id, email, display_name, role, phase, created_at, status, updated_at)
  values
      (new.id, new.email, v_display_name, v_role, v_phase,
       coalesce(new.created_at, now()), 'active', now())
  on conflict (id) do update set
      email = excluded.email,
      role = v_role,
      status = 'active',
      updated_at = now();

  return new;
exception when others then
  raise warning 'Error in handle_new_user trigger: %', sqlerrm;
  return new;
end $function$;
